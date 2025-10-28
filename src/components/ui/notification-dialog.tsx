"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  type?: "success" | "error" | "info";
}

export function NotificationDialog({
  open,
  onOpenChange,
  title,
  description,
  type = "info",
}: NotificationDialogProps) {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          titleColor: "#10b981",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ),
        };
      case "error":
        return {
          titleColor: "#dc2626",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          ),
        };
      default:
        return {
          titleColor: "#806D4B",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#806D4B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          ),
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        style={{
          backgroundColor: "#0F0F0F",
          border: "2px solid #806D4B",
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle
            style={{
              color: styles.titleColor,
              fontFamily: "var(--font-gascogne)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {styles.icon}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription
            style={{
              color: "#DCD3B8",
              fontFamily: "var(--font-pangea)",
              whiteSpace: "pre-wrap",
            }}
          >
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 text-sm font-medium tracking-wide transition-all hover:opacity-80"
            style={{
              backgroundColor: "#806D4B",
              color: "#0F0F0F",
              fontFamily: "var(--font-pangea)",
              border: "1px solid #806D4B",
            }}
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
