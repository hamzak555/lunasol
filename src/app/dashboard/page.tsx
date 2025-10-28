"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { format } from "date-fns";
import imageCompression from "browser-image-compression";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowUpDown, X, Upload } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  image_url: string;
  booking_link?: string;
  created_at: string;
}

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "title" | "created">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const supabase = createClient();

  // Form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [bookingLink, setBookingLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (!error && data) {
      setEvents(data);
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "date") {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === "created") {
      comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const toggleSort = (column: "date" | "title" | "created") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const processImageFile = async (file: File) => {
    setImageUploading(true);
    try {
      // Compress image options
      const options = {
        maxSizeMB: 2, // Maximum file size in MB
        maxWidthOrHeight: 1920, // Max width or height
        useWebWorker: true,
        fileType: 'image/jpeg', // Convert to JPEG for better compression
      };

      // Show original size
      console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

      // Compress the image
      const compressedFile = await imageCompression(file, options);

      // Show compressed size
      console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

      setImageFile(compressedFile);

      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageUploading(false);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Error processing image. Please try a different image.');
      setImageUploading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await processImageFile(file);
    } else {
      alert('Please drop an image file');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    // Use .jpg extension since we're compressing to JPEG
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("event-images").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!title || !date) {
        alert("Please fill in all required fields");
        setSubmitting(false);
        return;
      }

      let imageUrl = "";

      // Check if we need an image
      if (!editingEvent && !imageFile) {
        alert("Please upload an image for the event");
        setSubmitting(false);
        return;
      }

      if (imageFile) {
        // New image uploaded
        console.log("Uploading image...");
        imageUrl = await uploadImage(imageFile);
        console.log("Image uploaded:", imageUrl);
      } else if (editingEvent && imagePreview) {
        // Editing and keeping existing image
        imageUrl = editingEvent.image_url;
      }
      // If imageUrl is empty, it means the image was removed

      // Format date to string
      const formattedDate = format(date, "MMMM d, yyyy");
      console.log("Formatted date:", formattedDate);

      // Process booking link - add https:// if not present
      let processedBookingLink = bookingLink.trim();
      if (processedBookingLink && !processedBookingLink.startsWith('http://') && !processedBookingLink.startsWith('https://')) {
        processedBookingLink = `https://${processedBookingLink}`;
      }

      const eventData = {
        title,
        date: formattedDate,
        time: "", // Keep empty for backwards compatibility
        image_url: imageUrl,
        booking_link: processedBookingLink || null,
      };

      console.log("Saving event:", eventData);

      if (editingEvent) {
        // Update existing event
        const { data, error } = await supabase
          .from("events")
          .update(eventData)
          .eq("id", editingEvent.id)
          .select();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        console.log("Event updated:", data);
      } else {
        // Create new event
        const { data, error } = await supabase
          .from("events")
          .insert(eventData)
          .select();

        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
        console.log("Event created:", data);
      }

      // Reset form and refresh events
      setTitle("");
      setDate(undefined);
      setBookingLink("");
      setImageFile(null);
      setImagePreview("");
      setImageUploading(false);
      setIsDragging(false);
      setShowAddModal(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error: any) {
      console.error("Error saving event:", error);
      const errorMessage = error?.message || "Failed to save event. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    // Parse the date string back to a Date object
    try {
      const parsedDate = new Date(event.date);
      setDate(parsedDate);
    } catch {
      setDate(undefined);
    }
    setBookingLink(event.booking_link || "");
    setImagePreview(event.image_url);
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    const { error } = await supabase.from("events").delete().eq("id", eventToDelete.id);

    if (!error) {
      fetchEvents();
    } else {
      alert(`Error: ${error.message || "Failed to delete event"}`);
    }

    setEventToDelete(null);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingEvent(null);
    setTitle("");
    setDate(undefined);
    setBookingLink("");
    setImageFile(null);
    setImagePreview("");
    setImageUploading(false);
    setIsDragging(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-8 py-8">
        {/* Add Event Button */}
        <div className="mb-8 flex justify-between items-center">
          <h2
            className="text-3xl font-bold"
            style={{
              color: "#806D4B",
              fontFamily: "var(--font-gascogne)",
            }}
          >
            Events
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C]"
            style={{
              backgroundColor: "#806D4B",
              color: "#DCD3B8",
              fontFamily: "var(--font-gascogne)",
              border: "2px solid #806D4B",
            }}
          >
            Add Event
          </button>
        </div>

        {/* Events Table */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            backgroundColor: "#0F0F0F",
            border: "1px solid #806D4B",
          }}
        >
          <table className="w-full">
            <thead style={{ backgroundColor: "#2C2C2C" }}>
              <tr>
                <th
                  className="text-left px-6 py-4 font-bold"
                  style={{
                    color: "#806D4B",
                    fontFamily: "var(--font-gascogne)",
                  }}
                >
                  Image
                </th>
                <th
                  className="text-left px-6 py-4 font-bold"
                  style={{
                    color: "#806D4B",
                    fontFamily: "var(--font-gascogne)",
                  }}
                >
                  <button
                    onClick={() => toggleSort("title")}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    Title
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th
                  className="text-left px-6 py-4 font-bold"
                  style={{
                    color: "#806D4B",
                    fontFamily: "var(--font-gascogne)",
                  }}
                >
                  <button
                    onClick={() => toggleSort("date")}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    Date
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th
                  className="text-left px-6 py-4 font-bold"
                  style={{
                    color: "#806D4B",
                    fontFamily: "var(--font-gascogne)",
                  }}
                >
                  Booking Link
                </th>
                <th
                  className="text-left px-6 py-4 font-bold"
                  style={{
                    color: "#806D4B",
                    fontFamily: "var(--font-gascogne)",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center px-6 py-8"
                    style={{
                      color: "#DCD3B8",
                      fontFamily: "var(--font-pangea)",
                    }}
                  >
                    No events yet. Click "Add Event" to create one.
                  </td>
                </tr>
              ) : (
                sortedEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-t"
                    style={{ borderTopColor: "#806D4B" }}
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-20 h-20">
                        {event.image_url ? (
                          <Image
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div
                            className="w-full h-full rounded flex items-center justify-center text-center p-2"
                            style={{
                              backgroundColor: "#806D4B",
                              color: "#DCD3B8",
                              fontFamily: "var(--font-pangea)",
                            }}
                          >
                            <p className="text-[10px]">No Image</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{
                        color: "#DCD3B8",
                        fontFamily: "var(--font-pangea)",
                      }}
                    >
                      {event.title}
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{
                        color: "#DCD3B8",
                        fontFamily: "var(--font-pangea)",
                      }}
                    >
                      {event.date}
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{
                        color: "#DCD3B8",
                        fontFamily: "var(--font-pangea)",
                      }}
                    >
                      {event.booking_link ? (
                        <a
                          href={event.booking_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline hover:opacity-80 transition-opacity"
                          style={{
                            color: "#806D4B",
                            fontFamily: "var(--font-pangea)",
                          }}
                        >
                          View Link
                        </a>
                      ) : (
                        <span
                          className="text-sm"
                          style={{
                            color: "#DCD3B8",
                            fontFamily: "var(--font-pangea)",
                            opacity: 0.5,
                          }}
                        >
                          No Link
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="px-4 py-2 text-sm transition-all hover:bg-[#806D4B]"
                          style={{
                            color: "#DCD3B8",
                            fontFamily: "var(--font-pangea)",
                            border: "1px solid #806D4B",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setEventToDelete(event)}
                          className="px-4 py-2 text-sm transition-all hover:bg-red-900"
                          style={{
                            color: "#DCD3B8",
                            fontFamily: "var(--font-pangea)",
                            border: "1px solid #806D4B",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={closeModal}
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
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full transition-all hover:bg-[#806D4B]"
              style={{
                color: "#DCD3B8",
              }}
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
              {editingEvent ? "Edit Event" : "Add New Event"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Form Fields */}
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: "#DCD3B8",
                        fontFamily: "var(--font-pangea)",
                      }}
                    >
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: "#2C2C2C",
                        border: "1px solid #806D4B",
                        color: "#DCD3B8",
                        fontFamily: "var(--font-pangea)",
                      }}
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: "#DCD3B8",
                        fontFamily: "var(--font-pangea)",
                      }}
                    >
                      Date
                    </label>
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full px-4 py-3 rounded focus:outline-none focus:ring-2 flex items-center justify-start gap-2"
                          style={{
                            backgroundColor: "#2C2C2C",
                            border: "1px solid #806D4B",
                            color: "#DCD3B8",
                            fontFamily: "var(--font-pangea)",
                          }}
                        >
                          <CalendarIcon className="h-4 w-4" style={{ color: "#806D4B" }} />
                          {date ? (
                            format(date, "MMMM d, yyyy")
                          ) : (
                            <span style={{ opacity: 0.5 }}>Pick a date</span>
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        style={{
                          backgroundColor: "#2C2C2C",
                          border: "1px solid #806D4B",
                        }}
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => {
                            setDate(selectedDate);
                            setDatePickerOpen(false);
                          }}
                          initialFocus
                          className="rounded-md"
                          classNames={{
                            day_selected: "!bg-white !text-[#2C2C2C] !font-bold",
                          }}
                          style={{
                            backgroundColor: "#2C2C2C",
                            color: "#DCD3B8",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Booking Link */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: "#DCD3B8",
                        fontFamily: "var(--font-pangea)",
                      }}
                    >
                      Booking Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={bookingLink}
                      onChange={(e) => setBookingLink(e.target.value)}
                      placeholder="https://example.com/book"
                      className="w-full px-4 py-3 rounded focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: "#2C2C2C",
                        border: "1px solid #806D4B",
                        color: "#DCD3B8",
                        fontFamily: "var(--font-pangea)",
                      }}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C] disabled:opacity-50"
                      style={{
                        backgroundColor: "#806D4B",
                        color: "#DCD3B8",
                        fontFamily: "var(--font-gascogne)",
                        border: "2px solid #806D4B",
                      }}
                    >
                      {submitting
                        ? "Saving..."
                        : editingEvent
                        ? "Update"
                        : "Create"}
                    </button>
                  </div>
                </div>

                {/* Right Column - Image Upload/Preview (9:16 aspect ratio) */}
                <div className="flex flex-col">
                  <label
                    className="block text-sm font-medium mb-2 text-center"
                    style={{
                      color: "#DCD3B8",
                      fontFamily: "var(--font-pangea)",
                    }}
                  >
                    Event Image
                  </label>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <div className="flex items-start justify-center">
                    <div
                      className="relative rounded-lg overflow-hidden cursor-pointer transition-all"
                      style={{
                        width: "196px",
                        height: "350px",
                        backgroundColor: "#2C2C2C",
                        border: isDragging ? "2px dashed #DCD3B8" : "2px solid #806D4B",
                      }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={!imagePreview && !imageUploading ? handleUploadClick : undefined}
                    >
                      {imageUploading ? (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            backgroundColor: "rgba(15, 15, 15, 0.8)",
                          }}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#806D4B]"></div>
                            <p
                              className="text-sm"
                              style={{
                                color: "#DCD3B8",
                                fontFamily: "var(--font-pangea)",
                              }}
                            >
                              Processing...
                            </p>
                          </div>
                        </div>
                      ) : imagePreview ? (
                        <>
                          <Image
                            src={imagePreview}
                            alt="Event Preview"
                            fill
                            className="object-cover"
                          />
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage();
                            }}
                            className="absolute top-2 right-2 p-2 rounded-full transition-all hover:bg-red-900"
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.6)",
                              color: "#DCD3B8",
                            }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gap-2"
                          style={{
                            color: "#806D4B",
                            fontFamily: "var(--font-pangea)",
                          }}
                        >
                          <Upload className="h-10 w-10 mb-1" />
                          <p className="text-xs font-medium">
                            {isDragging ? "Drop image here" : "Click to upload or drag & drop"}
                          </p>
                          <p className="text-[10px] opacity-70">
                            JPG, PNG, or GIF (Max 2MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
        <AlertDialogContent
          style={{
            backgroundColor: "#0F0F0F",
            border: "2px solid #806D4B",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              style={{
                color: "#806D4B",
                fontFamily: "var(--font-gascogne)",
              }}
            >
              Delete Event
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{
                color: "#DCD3B8",
                fontFamily: "var(--font-pangea)",
              }}
            >
              Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="px-6 py-2 text-sm font-medium tracking-wide transition-all hover:bg-[#806D4B]"
              style={{
                color: "#DCD3B8",
                fontFamily: "var(--font-pangea)",
                border: "1px solid #806D4B",
                backgroundColor: "transparent",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="px-6 py-2 text-sm font-medium tracking-wide transition-all hover:bg-red-800"
              style={{
                backgroundColor: "#991b1b",
                color: "#DCD3B8",
                fontFamily: "var(--font-pangea)",
                border: "1px solid #991b1b",
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
