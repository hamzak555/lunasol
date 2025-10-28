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
import { NotificationDialog } from "@/components/ui/notification-dialog";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  image_url: string;
  booking_link?: string;
  is_ticketed: boolean;
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
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<{
    open: boolean;
    title: string;
    description: string;
    type: 'success' | 'error' | 'info';
  }>({ open: false, title: '', description: '', type: 'info' });
  const supabase = createClient();

  const showNotification = (title: string, description: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ open: true, title, description, type });
  };

  // Form state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [bookingLink, setBookingLink] = useState("");
  const [isTicketed, setIsTicketed] = useState(false);
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
      showNotification('Image Processing Error', 'Error processing image. Please try a different image.', 'error');
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
      showNotification('Invalid File', 'Please drop an image file', 'error');
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
        showNotification('Missing Fields', 'Please fill in all required fields', 'error');
        setSubmitting(false);
        return;
      }

      let imageUrl = "";

      // Check if we need an image
      if (!editingEvent && !imageFile) {
        showNotification('Missing Image', 'Please upload an image for the event', 'error');
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
        is_ticketed: isTicketed,
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
      setIsTicketed(false);
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
      showNotification('Save Error', `Error: ${errorMessage}`, 'error');
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
    setIsTicketed(event.is_ticketed || false);
    setImagePreview(event.image_url);
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    const { error } = await supabase.from("events").delete().eq("id", eventToDelete.id);

    if (!error) {
      fetchEvents();
      showNotification('Event Deleted', 'Event deleted successfully', 'success');
    } else {
      showNotification('Delete Error', `Error: ${error.message || "Failed to delete event"}`, 'error');
    }

    setEventToDelete(null);
  };

  const toggleEventSelection = (eventId: string) => {
    const newSelected = new Set(selectedEventIds);
    if (newSelected.has(eventId)) {
      newSelected.delete(eventId);
    } else {
      newSelected.add(eventId);
    }
    setSelectedEventIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedEventIds.size === events.length) {
      setSelectedEventIds(new Set());
    } else {
      setSelectedEventIds(new Set(events.map(e => e.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEventIds.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedEventIds.size} event(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .in("id", Array.from(selectedEventIds));

      if (!error) {
        fetchEvents();
        setSelectedEventIds(new Set());
        showNotification('Events Deleted', `Successfully deleted ${selectedEventIds.size} event(s)`, 'success');
      } else {
        showNotification('Delete Error', `Error: ${error.message || "Failed to delete events"}`, 'error');
      }
    } catch (error: any) {
      showNotification('Delete Error', `Error: ${error?.message || "Failed to delete events"}`, 'error');
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingEvent(null);
    setTitle("");
    setDate(undefined);
    setBookingLink("");
    setIsTicketed(false);
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
            {selectedEventIds.size > 0 && (
              <span
                className="ml-3 text-base font-normal"
                style={{
                  color: "#DCD3B8",
                  fontFamily: "var(--font-pangea)",
                }}
              >
                ({selectedEventIds.size} selected)
              </span>
            )}
          </h2>
          <div className="flex gap-3">
            {selectedEventIds.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-6 py-3 text-lg font-bold tracking-wide transition-all hover:opacity-80 rounded-md"
                style={{
                  backgroundColor: "#dc2626",
                  color: "#DCD3B8",
                  fontFamily: "var(--font-gascogne)",
                  border: "2px solid #dc2626",
                }}
              >
                Delete Selected ({selectedEventIds.size})
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-3 text-lg font-bold tracking-wide transition-all hover:bg-[#DCD3B8] hover:text-[#2C2C2C] rounded-md"
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
                  className="text-left px-4 py-4"
                  style={{
                    color: "#806D4B",
                    fontFamily: "var(--font-gascogne)",
                  }}
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEventIds.size === events.length && events.length > 0}
                      onChange={toggleSelectAll}
                      className="appearance-none w-5 h-5 rounded border-2 cursor-pointer relative transition-all"
                      style={{
                        borderColor: "#806D4B",
                        backgroundColor: selectedEventIds.size === events.length && events.length > 0 ? "#806D4B" : "transparent"
                      }}
                    />
                    {selectedEventIds.size === events.length && events.length > 0 && (
                      <svg
                        className="absolute w-5 h-5 pointer-events-none"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#DCD3B8"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </label>
                </th>
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
                    colSpan={6}
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
                    <td className="px-4 py-4">
                      <label className="flex items-center cursor-pointer relative">
                        <input
                          type="checkbox"
                          checked={selectedEventIds.has(event.id)}
                          onChange={() => toggleEventSelection(event.id)}
                          className="appearance-none w-5 h-5 rounded border-2 cursor-pointer transition-all"
                          style={{
                            borderColor: "#806D4B",
                            backgroundColor: selectedEventIds.has(event.id) ? "#806D4B" : "transparent"
                          }}
                        />
                        {selectedEventIds.has(event.id) && (
                          <svg
                            className="absolute w-5 h-5 pointer-events-none"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#DCD3B8"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </label>
                    </td>
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
                          className="px-4 py-2 text-sm transition-all hover:bg-[#806D4B] rounded-md"
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
                          className="px-4 py-2 text-sm transition-all hover:opacity-80 rounded-md"
                          style={{
                            backgroundColor: "#dc2626",
                            color: "#DCD3B8",
                            fontFamily: "var(--font-pangea)",
                            border: "1px solid #dc2626",
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
            className="w-full max-w-5xl mx-4 p-7 rounded-lg relative"
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
                <div className="flex flex-col">
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
                      Event Title *
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
                      Date *
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

                  {/* Event Type Selector */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: "#DCD3B8",
                        fontFamily: "var(--font-pangea)",
                      }}
                    >
                      Event Type
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setIsTicketed(false)}
                        className="flex-1 px-4 py-3 rounded-md transition-all"
                        style={{
                          backgroundColor: !isTicketed ? "#806D4B" : "#2C2C2C",
                          border: `2px solid ${!isTicketed ? "#DCD3B8" : "#806D4B"}`,
                          color: "#DCD3B8",
                          fontFamily: "var(--font-pangea)",
                        }}
                      >
                        Regular
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsTicketed(true)}
                        className="flex-1 px-4 py-3 rounded-md transition-all"
                        style={{
                          backgroundColor: isTicketed ? "#806D4B" : "#2C2C2C",
                          border: `2px solid ${isTicketed ? "#DCD3B8" : "#806D4B"}`,
                          color: "#DCD3B8",
                          fontFamily: "var(--font-pangea)",
                        }}
                      >
                        Ticketed
                      </button>
                    </div>
                  </div>

                  {/* Booking/Ticketing Link */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{
                        color: "#DCD3B8",
                        fontFamily: "var(--font-pangea)",
                      }}
                    >
                      Booking/Ticketing Link
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

                  {/* Create Button */}
                  <div className="mt-6">
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
                      {submitting
                        ? "Saving..."
                        : editingEvent
                        ? "Update"
                        : "Create"}
                    </button>
                  </div>
                  </div>
                </div>

                {/* Right Column - Image Upload/Preview (9:16 aspect ratio) */}
                <div className="flex flex-col justify-end">
                  <label
                    className="block text-sm font-medium mb-2 text-center"
                    style={{
                      color: "#DCD3B8",
                      fontFamily: "var(--font-pangea)",
                    }}
                  >
                    Event Image *
                  </label>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <div className="flex items-end justify-center">
                    <div
                      className="relative rounded-lg overflow-hidden cursor-pointer transition-all"
                      style={{
                        width: "100%",
                        maxWidth: "247px",
                        aspectRatio: "9/16",
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
              className="px-6 py-2 text-sm font-medium tracking-wide transition-all hover:bg-[#806D4B] rounded-md"
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
              className="px-6 py-2 text-sm font-medium tracking-wide transition-all hover:opacity-80 rounded-md"
              style={{
                backgroundColor: "#dc2626",
                color: "#DCD3B8",
                fontFamily: "var(--font-pangea)",
                border: "1px solid #dc2626",
              }}
            >
              Delete
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
