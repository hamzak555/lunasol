'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { createClient } from '@/lib/supabase/client';
import imageCompression from 'browser-image-compression';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { NotificationDialog } from '@/components/ui/notification-dialog';

type GalleryItem = {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  position: number;
  created_at: string;
};

export default function GalleryDashboard() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<GalleryItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [replacingItemId, setReplacingItemId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [showDeleteMultiple, setShowDeleteMultiple] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    title: string;
    description: string;
    type: 'success' | 'error' | 'info';
  }>({ open: false, title: '', description: '', type: 'info' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const showNotification = (title: string, description: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ open: true, title, description, type });
  };

  useEffect(() => {
    loadGalleryItems();
  }, []);

  async function loadGalleryItems() {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;

      setItems(data || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  }

  async function uploadFiles(files: FileList | File[]) {
    if (!files || files.length === 0) return;

    setUploading(true);

    const successfulUploads: string[] = [];
    const failedUploads: string[] = [];

    try {
      // Get the current max position
      const { data: existingItems } = await supabase
        .from('gallery')
        .select('position')
        .order('position', { ascending: false })
        .limit(1);

      let currentPosition = existingItems && existingItems.length > 0
        ? existingItems[0].position + 1
        : 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isVideo && !isImage) {
          console.warn(`Skipping ${file.name}: Only images and videos are allowed`);
          failedUploads.push(`${file.name} (invalid type)`);
          continue;
        }

        try {
          let fileToUpload = file;

          // Compress images
          if (isImage) {
            const options = {
              maxSizeMB: 2,
              maxWidthOrHeight: 2048,
              useWebWorker: true,
            };

            try {
              fileToUpload = await imageCompression(file, options);
              console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
            } catch (compressionError) {
              console.error('Error compressing image:', compressionError);
              // Continue with original file if compression fails
              fileToUpload = file;
            }
          }

          // Generate unique filename
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = fileName;

          console.log(`Uploading ${file.name} (${i + 1}/${files.length})...`);

          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('gallery-media')
            .upload(filePath, fileToUpload, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error(`Upload error for ${file.name}:`, uploadError);
            failedUploads.push(`${file.name} (storage error: ${uploadError.message})`);
            continue;
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('gallery-media')
            .getPublicUrl(filePath);

          console.log(`Inserting ${file.name} into database at position ${currentPosition}...`);

          // Insert into database
          const { error: dbError } = await supabase
            .from('gallery')
            .insert({
              media_url: urlData.publicUrl,
              media_type: isVideo ? 'video' : 'image',
              position: currentPosition,
            });

          if (dbError) {
            console.error(`Database error for ${file.name}:`, dbError);
            failedUploads.push(`${file.name} (database error: ${dbError.message})`);
            // Try to clean up the uploaded file
            await supabase.storage.from('gallery-media').remove([filePath]);
            continue;
          }

          successfulUploads.push(file.name);
          currentPosition++;
          console.log(`✓ Successfully uploaded ${file.name}`);

        } catch (fileError: any) {
          console.error(`Error processing ${file.name}:`, fileError);
          failedUploads.push(`${file.name} (${fileError.message || 'unknown error'})`);
        }
      }

      // Reload gallery items
      await loadGalleryItems();

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Show results
      if (successfulUploads.length > 0 && failedUploads.length === 0) {
        showNotification('Upload Successful', `Successfully uploaded ${successfulUploads.length} file(s)!`, 'success');
      } else if (successfulUploads.length > 0 && failedUploads.length > 0) {
        showNotification('Partial Upload', `Uploaded ${successfulUploads.length} file(s).\n\nFailed to upload ${failedUploads.length} file(s):\n${failedUploads.join('\n')}`, 'error');
      } else if (failedUploads.length > 0) {
        showNotification('Upload Failed', `Failed to upload all files:\n${failedUploads.join('\n')}`, 'error');
      }

    } catch (error: any) {
      console.error('Error uploading files:', error);
      showNotification('Upload Error', `Error uploading files: ${error.message || 'Unknown error'}. Check console for details.`, 'error');
    } finally {
      setUploading(false);
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    await uploadFiles(files);
  }

  function handleFileDrop(event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingFile(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
  }

  function handleFileDragOver(event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingFile(true);
  }

  function handleFileDragLeave(event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingFile(false);
  }

  function toggleItemSelection(itemId: string) {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  }

  function selectAll() {
    setSelectedItems(new Set(items.map(item => item.id)));
  }

  function deselectAll() {
    setSelectedItems(new Set());
  }

  async function deleteSelectedItems() {
    if (selectedItems.size === 0) return;

    try {
      for (const itemId of selectedItems) {
        const item = items.find(i => i.id === itemId);
        if (!item) continue;

        // Extract file path from URL
        const url = new URL(item.media_url);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];

        // Delete from storage
        await supabase.storage
          .from('gallery-media')
          .remove([fileName]);

        // Delete from database
        await supabase
          .from('gallery')
          .delete()
          .eq('id', itemId);
      }

      // Clear selection and reload
      setSelectedItems(new Set());
      setShowDeleteMultiple(false);
      await loadGalleryItems();
      showNotification('Delete Successful', `Successfully deleted ${selectedItems.size} item(s).`, 'success');
    } catch (error) {
      console.error('Error deleting items:', error);
      showNotification('Delete Error', 'Error deleting items. Please try again.', 'error');
    }
  }

  function handleReplaceClick(itemId: string) {
    setReplacingItemId(itemId);
    replaceInputRef.current?.click();
  }

  async function handleReplaceFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !replacingItemId) return;

    const item = items.find(i => i.id === replacingItemId);
    if (!item) return;

    setUploading(true);

    try {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');

      if (!isVideo && !isImage) {
        showNotification('Invalid File Type', 'Only images and videos are allowed', 'error');
        return;
      }

      let fileToUpload = file;

      // Compress images
      if (isImage) {
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 2048,
          useWebWorker: true,
        };

        try {
          fileToUpload = await imageCompression(file, options);
          console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
        } catch (compressionError) {
          console.error('Error compressing image:', compressionError);
          fileToUpload = file;
        }
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      console.log(`Uploading replacement file...`);

      // Upload new file to storage
      const { error: uploadError } = await supabase.storage
        .from('gallery-media')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        showNotification('Upload Error', uploadError.message, 'error');
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('gallery-media')
        .getPublicUrl(filePath);

      console.log(`Updating database record...`);

      // Update database with new URL and type
      const { error: dbError } = await supabase
        .from('gallery')
        .update({
          media_url: urlData.publicUrl,
          media_type: isVideo ? 'video' : 'image',
        })
        .eq('id', replacingItemId);

      if (dbError) {
        console.error('Database error:', dbError);
        showNotification('Database Error', dbError.message, 'error');
        // Clean up uploaded file
        await supabase.storage.from('gallery-media').remove([filePath]);
        return;
      }

      // Delete old file from storage
      try {
        const oldUrl = new URL(item.media_url);
        const oldPathParts = oldUrl.pathname.split('/');
        const oldFileName = oldPathParts[oldPathParts.length - 1];

        await supabase.storage
          .from('gallery-media')
          .remove([oldFileName]);

        console.log('Old file deleted from storage');
      } catch (deleteError) {
        console.error('Error deleting old file:', deleteError);
        // Don't fail the whole operation if cleanup fails
      }

      // Reload gallery items
      await loadGalleryItems();

      showNotification('Replace Successful', 'Media replaced successfully!', 'success');

      // Reset file input
      if (replaceInputRef.current) {
        replaceInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error replacing file:', error);
      showNotification('Replace Error', `Error replacing file: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      setUploading(false);
      setReplacingItemId(null);
    }
  }

  async function handleDelete() {
    if (!itemToDelete) return;

    try {
      const item = itemToDelete;
      // Extract file path from URL
      const url = new URL(item.media_url);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];

      // Delete from storage
      await supabase.storage
        .from('gallery-media')
        .remove([fileName]);

      // Delete from database
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      // Reload items
      setItemToDelete(null);
      await loadGalleryItems();
      showNotification('Delete Successful', 'Item deleted successfully.', 'success');
    } catch (error) {
      console.error('Error deleting item:', error);
      showNotification('Delete Error', 'Error deleting item. Please try again.', 'error');
    }
  }

  async function updatePosition(itemId: string, newPosition: number) {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ position: newPosition })
        .eq('id', itemId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating position:', error);
    }
  }

  function handleDragStart(item: GalleryItem) {
    setDraggedItem(item);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  async function handleDrop(targetItem: GalleryItem) {
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const newItems = [...items];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = newItems.findIndex(item => item.id === targetItem.id);

    // Remove dragged item
    newItems.splice(draggedIndex, 1);
    // Insert at target position
    newItems.splice(targetIndex, 0, draggedItem);

    // Update positions
    const updates = newItems.map((item, index) => ({
      id: item.id,
      position: index,
    }));

    setItems(newItems.map((item, index) => ({ ...item, position: index })));

    // Update in database
    for (const update of updates) {
      await updatePosition(update.id, update.position);
    }

    setDraggedItem(null);
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: '#DCD3B8', fontFamily: 'var(--font-gascogne)' }}
            >
              Gallery Management
            </h1>
          </div>

          <div className="flex gap-3">
            {selectedItems.size > 0 && (
              <>
                <button
                  onClick={deselectAll}
                  className="px-4 py-3 rounded-md transition-all hover:opacity-80 flex items-center gap-2"
                  style={{
                    backgroundColor: 'rgba(128, 109, 75, 0.2)',
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)',
                    fontWeight: 600,
                    border: '1px solid #806D4B',
                  }}
                >
                  Deselect All
                </button>
                <button
                  onClick={() => setShowDeleteMultiple(true)}
                  className="px-4 py-3 rounded-md transition-all hover:opacity-80 flex items-center gap-2"
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#DCD3B8',
                    fontFamily: 'var(--font-pangea)',
                    fontWeight: 600,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete Selected ({selectedItems.size})
                </button>
              </>
            )}
            <label
              className="px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C] cursor-pointer rounded-md"
              style={{
                backgroundColor: '#806D4B',
                color: '#DCD3B8',
                fontFamily: 'var(--font-gascogne)',
                border: '2px solid #806D4B',
              }}
            >
              {uploading ? 'Uploading...' : 'Upload Media'}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {loading ? (
          <div
            className="text-center py-12"
            style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
          >
            Loading gallery...
          </div>
        ) : items.length === 0 ? (
          <div
            className="text-center py-12 rounded-lg border-2 border-dashed cursor-pointer transition-all hover:border-[#DCD3B8]"
            style={{
              borderColor: '#806D4B',
              color: '#806D4B',
              fontFamily: 'var(--font-pangea)',
              backgroundColor: isDraggingFile ? 'rgba(128, 109, 75, 0.1)' : 'transparent',
            }}
            onDrop={handleFileDrop}
            onDragOver={handleFileDragOver}
            onDragLeave={handleFileDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4 opacity-50"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="text-lg mb-2">No gallery items yet</p>
            <p className="text-sm opacity-70">Drag and drop files here or click to upload</p>
          </div>
        ) : (
          <div>
            <div
              className="mb-4 p-4 rounded"
              style={{
                backgroundColor: 'rgba(128, 109, 75, 0.1)',
                border: '1px solid #806D4B',
              }}
            >
              <div className="flex justify-between items-center">
                <p
                  className="text-sm"
                  style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
                >
                  <strong>Tips:</strong> Drag files here to upload • Drag items to reorder • Click items to select for deletion
                </p>
                {items.length > 0 && selectedItems.size === 0 && (
                  <button
                    onClick={selectAll}
                    className="text-sm px-3 py-1 rounded-md transition-all hover:opacity-80"
                    style={{
                      color: '#DCD3B8',
                      fontFamily: 'var(--font-pangea)',
                      border: '1px solid #806D4B',
                    }}
                  >
                    Select All
                  </button>
                )}
              </div>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rounded-lg transition-all"
              style={{
                border: isDraggingFile ? '2px dashed #806D4B' : '2px dashed transparent',
                backgroundColor: isDraggingFile ? 'rgba(128, 109, 75, 0.05)' : 'transparent',
                padding: isDraggingFile ? '1rem' : '0',
              }}
              onDrop={handleFileDrop}
              onDragOver={handleFileDragOver}
              onDragLeave={handleFileDragLeave}
            >
              {items.map((item) => {
                const isSelected = selectedItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(item)}
                    onClick={() => toggleItemSelection(item.id)}
                    className="rounded-lg overflow-hidden cursor-pointer transition-all"
                    style={{
                      backgroundColor: '#0F0F0F',
                      border: isSelected ? '3px solid #DCD3B8' : '2px solid #806D4B',
                      boxShadow: isSelected ? '0 0 20px rgba(220, 211, 184, 0.3)' : 'none',
                    }}
                  >
                    <div className="relative aspect-square">
                      {item.media_type === 'image' ? (
                        <img
                          src={item.media_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={item.media_url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                        />
                      )}
                      {/* Selection Overlay */}
                      {isSelected && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(220, 211, 184, 0.3)' }}
                        >
                          <div
                            className="rounded-full p-2"
                            style={{ backgroundColor: '#DCD3B8' }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#0F0F0F"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: 'rgba(15, 15, 15, 0.8)',
                            color: '#DCD3B8',
                            fontFamily: 'var(--font-pangea)',
                          }}
                        >
                          #{item.position + 1}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex justify-between items-center">
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: 'rgba(128, 109, 75, 0.2)',
                          color: '#806D4B',
                          fontFamily: 'var(--font-pangea)',
                        }}
                      >
                        {item.media_type === 'image' ? 'Image' : 'Video'}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReplaceClick(item.id);
                          }}
                          className="p-2 rounded-md transition-all hover:bg-[#806D4B]/20"
                          style={{ color: '#806D4B' }}
                          title="Replace media"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete(item);
                          }}
                          className="p-2 rounded-md transition-all hover:bg-red-600/20"
                          style={{ color: '#dc2626' }}
                          title="Delete media"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hidden file input for replacing */}
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleReplaceFile}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {/* Delete Single Item Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent
          style={{
            backgroundColor: '#0F0F0F',
            border: '2px solid #806D4B',
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              style={{
                color: '#806D4B',
                fontFamily: 'var(--font-gascogne)',
              }}
            >
              Delete Media
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)',
              }}
            >
              Are you sure you want to delete this {itemToDelete?.media_type}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="px-6 py-2 text-sm font-medium tracking-wide transition-all hover:bg-[#806D4B] rounded-md"
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)',
                border: '1px solid #806D4B',
                backgroundColor: 'transparent',
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="px-6 py-2 text-sm font-medium tracking-wide transition-all hover:opacity-80 rounded-md"
              style={{
                backgroundColor: '#dc2626',
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)',
                border: '1px solid #dc2626',
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Multiple Items Confirmation Dialog */}
      <AlertDialog open={showDeleteMultiple} onOpenChange={setShowDeleteMultiple}>
        <AlertDialogContent
          style={{
            backgroundColor: '#0F0F0F',
            border: '2px solid #806D4B',
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              style={{
                color: '#806D4B',
                fontFamily: 'var(--font-gascogne)',
              }}
            >
              Delete Selected Items
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)',
              }}
            >
              Are you sure you want to delete {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="px-6 py-2 text-sm font-medium tracking-wide transition-all hover:bg-[#806D4B] rounded-md"
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)',
                border: '1px solid #806D4B',
                backgroundColor: 'transparent',
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteSelectedItems}
              className="px-6 py-2 text-sm font-medium tracking-wide transition-all hover:opacity-80 rounded-md"
              style={{
                backgroundColor: '#dc2626',
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)',
                border: '1px solid #dc2626',
              }}
            >
              Delete {selectedItems.size} Item{selectedItems.size > 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Notification Dialog */}
      <NotificationDialog
        open={notification.open}
        onOpenChange={(open) => setNotification({ ...notification, open })}
        title={notification.title}
        description={notification.description}
        type={notification.type}
      />
    </DashboardLayout>
  );
}
