"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { X, Upload } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { NotificationDialog } from "@/components/ui/notification-dialog";

interface Artist {
  id: string;
  name: string;
  image_url: string;
  instagram_handle: string | null;
  display_order: number;
  created_at: string;
}

export default function DashboardFamilyPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedArtists, setSelectedArtists] = useState<Set<string>>(new Set());
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);
  const [showDeleteMultiple, setShowDeleteMultiple] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    title: string;
    description: string;
    type: 'success' | 'error' | 'info';
  }>({ open: false, title: '', description: '', type: 'info' });

  // Form state
  const [artistName, setArtistName] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchArtists();
  }, []);

  const showNotification = (title: string, description: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ open: true, title, description, type });
  };

  async function fetchArtists() {
    setLoading(true);
    const { data, error } = await supabase
      .from('family')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching artists:', error);
      showNotification('Error', 'Failed to load artists', 'error');
    } else {
      setArtists(data || []);
    }
    setLoading(false);
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!artistName || !imageFile) {
        showNotification('Missing Fields', 'Please provide artist name and image', 'error');
        setSubmitting(false);
        return;
      }

      // Compress image
      let fileToUpload = imageFile;
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };
        fileToUpload = await imageCompression(imageFile, options);
      } catch (error) {
        console.error('Error compressing image:', error);
      }

      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${fileToUpload.name}`;
      const filePath = `family/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, fileToUpload);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      // Get next display order
      const nextOrder = artists.length > 0
        ? Math.max(...artists.map(a => a.display_order)) + 1
        : 0;

      // Insert into database
      const { error: dbError } = await supabase
        .from('family')
        .insert({
          name: artistName,
          image_url: publicUrl,
          instagram_handle: instagramHandle || null,
          display_order: nextOrder
        });

      if (dbError) {
        throw new Error(dbError.message);
      }

      showNotification('Success', 'Artist added successfully!', 'success');
      setShowAddModal(false);
      setArtistName("");
      setInstagramHandle("");
      setImageFile(null);
      setImagePreview("");
      fetchArtists();
    } catch (error: any) {
      showNotification('Error', error.message || 'Failed to add artist', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (artist: Artist) => {
    setEditingArtist(artist);
    setArtistName(artist.name);
    setInstagramHandle(artist.instagram_handle || "");
    setImagePreview(artist.image_url);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtist) return;

    setSubmitting(true);

    try {
      if (!artistName) {
        showNotification('Missing Fields', 'Please provide artist name', 'error');
        setSubmitting(false);
        return;
      }

      let imageUrl = editingArtist.image_url;

      // If new image is selected, upload it
      if (imageFile) {
        // Compress image
        let fileToUpload = imageFile;
        try {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
          };
          fileToUpload = await imageCompression(imageFile, options);
        } catch (error) {
          console.error('Error compressing image:', error);
        }

        // Upload to Supabase Storage
        const fileName = `${Date.now()}-${fileToUpload.name}`;
        const filePath = `family/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, fileToUpload);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Update in database
      const { error: dbError } = await supabase
        .from('family')
        .update({
          name: artistName,
          image_url: imageUrl,
          instagram_handle: instagramHandle || null,
        })
        .eq('id', editingArtist.id);

      if (dbError) {
        throw new Error(dbError.message);
      }

      showNotification('Success', 'Artist updated successfully!', 'success');
      setShowEditModal(false);
      setEditingArtist(null);
      setArtistName("");
      setInstagramHandle("");
      setImageFile(null);
      setImagePreview("");
      fetchArtists();
    } catch (error: any) {
      showNotification('Error', error.message || 'Failed to update artist', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!artistToDelete) return;

    try {
      const { error } = await supabase
        .from('family')
        .delete()
        .eq('id', artistToDelete.id);

      if (error) throw error;

      showNotification('Success', 'Artist deleted successfully', 'success');
      fetchArtists();
    } catch (error: any) {
      showNotification('Error', error.message || 'Failed to delete artist', 'error');
    }
    setArtistToDelete(null);
  };

  const deleteSelectedArtists = async () => {
    if (selectedArtists.size === 0) return;

    try {
      const { error } = await supabase
        .from('family')
        .delete()
        .in('id', Array.from(selectedArtists));

      if (error) throw error;

      showNotification('Success', `Deleted ${selectedArtists.size} artist(s)`, 'success');
      setSelectedArtists(new Set());
      setShowDeleteMultiple(false);
      fetchArtists();
    } catch (error: any) {
      showNotification('Error', error.message || 'Failed to delete artists', 'error');
    }
  };

  const toggleArtistSelection = (artistId: string) => {
    const newSelected = new Set(selectedArtists);
    if (newSelected.has(artistId)) {
      newSelected.delete(artistId);
    } else {
      newSelected.add(artistId);
    }
    setSelectedArtists(newSelected);
  };

  const selectAll = () => {
    setSelectedArtists(new Set(artists.map(a => a.id)));
  };

  const deselectAll = () => {
    setSelectedArtists(new Set());
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'));

    if (dragIndex === dropIndex) return;

    const newArtists = [...artists];
    const [draggedArtist] = newArtists.splice(dragIndex, 1);
    newArtists.splice(dropIndex, 0, draggedArtist);

    // Update display order
    const updates = newArtists.map((artist, index) => ({
      id: artist.id,
      display_order: index
    }));

    setArtists(newArtists);

    // Update in database
    try {
      for (const update of updates) {
        await supabase
          .from('family')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      showNotification('Error', 'Failed to update order', 'error');
      fetchArtists();
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h2
            className="text-3xl font-bold"
            style={{
              color: '#806D4B',
              fontFamily: 'var(--font-gascogne)',
            }}
          >
            Family
            {selectedArtists.size > 0 && (
              <span
                className="ml-3 text-base font-normal"
                style={{
                  color: '#DCD3B8',
                  fontFamily: 'var(--font-pangea)',
                }}
              >
                ({selectedArtists.size} selected)
              </span>
            )}
          </h2>

          <div className="flex gap-3">
            {selectedArtists.size > 0 && (
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
                  Delete Selected ({selectedArtists.size})
                </button>
              </>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C] rounded-md"
              style={{
                backgroundColor: '#806D4B',
                color: '#DCD3B8',
                fontFamily: 'var(--font-gascogne)',
                border: '2px solid #806D4B',
              }}
            >
              Add Artist
            </button>
          </div>
        </div>

        {loading ? (
          <div
            className="text-center py-12"
            style={{ color: '#DCD3B8', fontFamily: 'var(--font-pangea)' }}
          >
            Loading artists...
          </div>
        ) : artists.length === 0 ? (
          <div
            className="text-center py-20 rounded-lg"
            style={{
              backgroundColor: '#0F0F0F',
              border: '2px dashed #806D4B',
              color: '#DCD3B8',
              fontFamily: 'var(--font-pangea)'
            }}
          >
            <p className="text-xl mb-4">No artists yet</p>
            <p className="opacity-70">Click "Add Artist" to get started</p>
          </div>
        ) : (
          <>
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
                  <strong>Tips:</strong> Drag items to reorder • Click items to select for deletion
                </p>
                {artists.length > 0 && selectedArtists.size === 0 && (
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artists.map((artist, index) => {
                const isSelected = selectedArtists.has(artist.id);

                return (
                  <div
                    key={artist.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onClick={() => toggleArtistSelection(artist.id)}
                    className="rounded-lg overflow-hidden cursor-pointer transition-all"
                    style={{
                      backgroundColor: '#0F0F0F',
                      border: isSelected ? '3px solid #DCD3B8' : '2px solid #806D4B',
                      boxShadow: isSelected ? '0 0 20px rgba(220, 211, 184, 0.3)' : 'none',
                    }}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={artist.image_url}
                        alt={artist.name}
                        fill
                        className="object-cover"
                      />

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

                      {/* Position number at top left */}
                      <div className="absolute top-2 left-2">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: 'rgba(15, 15, 15, 0.8)',
                            color: '#DCD3B8',
                            fontFamily: 'var(--font-pangea)',
                          }}
                        >
                          #{artist.display_order + 1}
                        </span>
                      </div>
                    </div>

                    {/* Bottom section with artist info and buttons */}
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <span
                          className="text-sm font-medium"
                          style={{
                            color: '#DCD3B8',
                            fontFamily: 'var(--font-gascogne)',
                          }}
                        >
                          {artist.name}
                        </span>
                        {artist.instagram_handle && (
                          <span
                            className="text-xs"
                            style={{
                              color: '#806D4B',
                              fontFamily: 'var(--font-pangea)',
                            }}
                          >
                            @{artist.instagram_handle.replace('@', '')}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(artist);
                          }}
                          className="p-2 rounded-md transition-all hover:bg-[#806D4B]/20"
                          style={{ color: '#806D4B' }}
                          title="Edit artist"
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
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                          </svg>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setArtistToDelete(artist);
                          }}
                          className="p-2 rounded-md transition-all hover:bg-red-600/20"
                          style={{ color: '#dc2626' }}
                          title="Delete artist"
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
          </>
        )}
      </div>

      {/* Add Artist Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-md mx-4 p-7 rounded-lg relative"
            style={{
              backgroundColor: "#0F0F0F",
              border: "2px solid #806D4B",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full transition-all hover:bg-[#806D4B]"
              style={{ color: "#DCD3B8" }}
            >
              <X className="h-5 w-5" />
            </button>

            <h2
              className="text-2xl font-bold mb-6"
              style={{
                color: "#806D4B",
                fontFamily: "var(--font-gascogne)",
              }}
            >
              Add Artist
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Artist Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                >
                  Artist Name *
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#2C2C2C",
                    border: "1px solid #806D4B",
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                  placeholder="Enter artist name"
                />
              </div>

              {/* Instagram Handle */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                >
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#2C2C2C",
                    border: "1px solid #806D4B",
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                  placeholder="@artist or full URL"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                >
                  Artist Image *
                </label>
                <div
                  className="relative w-full rounded-lg overflow-hidden cursor-pointer transition-all hover:border-[#DCD3B8]"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    aspectRatio: '1/1',
                    maxWidth: '300px',
                    margin: '0 auto',
                    border: '2px dashed #806D4B',
                    backgroundColor: '#2C2C2C'
                  }}
                >
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview("");
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full transition-all hover:opacity-80"
                        style={{
                          backgroundColor: "#dc2626",
                          color: "#DCD3B8",
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
                      style={{
                        color: "#806D4B",
                        fontFamily: "var(--font-pangea)",
                      }}
                    >
                      <Upload className="h-10 w-10 mb-2" />
                      <p className="text-sm">Click to upload image</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C] disabled:opacity-50 rounded-md"
                style={{
                  backgroundColor: "#806D4B",
                  color: "#DCD3B8",
                  fontFamily: "var(--font-gascogne)",
                  border: "2px solid #806D4B",
                }}
              >
                {submitting ? "Adding..." : "Add Artist"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Artist Modal */}
      {showEditModal && editingArtist && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={() => {
            setShowEditModal(false);
            setEditingArtist(null);
            setArtistName("");
            setInstagramHandle("");
            setImageFile(null);
            setImagePreview("");
          }}
        >
          <div
            className="w-full max-w-md mx-4 p-7 rounded-lg relative"
            style={{
              backgroundColor: "#0F0F0F",
              border: "2px solid #806D4B",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditingArtist(null);
                setArtistName("");
                setInstagramHandle("");
                setImageFile(null);
                setImagePreview("");
              }}
              className="absolute top-4 right-4 p-2 rounded-full transition-all hover:bg-[#806D4B]"
              style={{ color: "#DCD3B8" }}
            >
              <X className="h-5 w-5" />
            </button>

            <h2
              className="text-2xl font-bold mb-6"
              style={{
                color: "#806D4B",
                fontFamily: "var(--font-gascogne)",
              }}
            >
              Edit Artist
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Artist Name */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                >
                  Artist Name *
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#2C2C2C",
                    border: "1px solid #806D4B",
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                  placeholder="Enter artist name"
                />
              </div>

              {/* Instagram Handle */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                >
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "#2C2C2C",
                    border: "1px solid #806D4B",
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                  placeholder="@artist or full URL"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DCD3B8",
                    fontFamily: "var(--font-pangea)",
                  }}
                >
                  Artist Image {imageFile ? "" : "(optional - current image will be kept)"}
                </label>
                <div
                  className="relative w-full rounded-lg overflow-hidden cursor-pointer transition-all hover:border-[#DCD3B8]"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    aspectRatio: '1/1',
                    maxWidth: '300px',
                    margin: '0 auto',
                    border: '2px dashed #806D4B',
                    backgroundColor: '#2C2C2C'
                  }}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          if (editingArtist) {
                            // Keep the existing image preview when editing
                            setImagePreview(editingArtist.image_url);
                          } else {
                            setImagePreview("");
                          }
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full transition-all hover:opacity-80"
                        style={{
                          backgroundColor: "#dc2626",
                          color: "#DCD3B8",
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
                      style={{
                        color: "#806D4B",
                        fontFamily: "var(--font-pangea)",
                      }}
                    >
                      <Upload className="h-10 w-10 mb-2" />
                      <p className="text-sm">Click to upload new image</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C] disabled:opacity-50 rounded-md"
                style={{
                  backgroundColor: "#806D4B",
                  color: "#DCD3B8",
                  fontFamily: "var(--font-gascogne)",
                  border: "2px solid #806D4B",
                }}
              >
                {submitting ? "Updating..." : "Update Artist"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Single Artist Dialog */}
      <AlertDialog open={!!artistToDelete} onOpenChange={() => setArtistToDelete(null)}>
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
              Delete Artist
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)',
              }}
            >
              Are you sure you want to delete {artistToDelete?.name}? This action cannot be undone.
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

      {/* Delete Multiple Artists Dialog */}
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
              Delete Multiple Artists
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)',
              }}
            >
              Are you sure you want to delete {selectedArtists.size} artist{selectedArtists.size > 1 ? 's' : ''}? This action cannot be undone.
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
              onClick={deleteSelectedArtists}
              className="px-6 py-2 text-sm font-medium tracking-wide transition-all hover:opacity-80 rounded-md"
              style={{
                backgroundColor: '#dc2626',
                color: '#DCD3B8',
                fontFamily: 'var(--font-pangea)',
                border: '1px solid #dc2626',
              }}
            >
              Delete {selectedArtists.size} Artist{selectedArtists.size > 1 ? 's' : ''}
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
