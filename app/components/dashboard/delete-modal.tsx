"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title?: string;
  description?: string;
  itemName?: string;
}

export function DeleteModal({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  title = "Delete Software",
  description = "Are you sure you want to delete this software? This action cannot be undone.",
  itemName,
}: DeleteModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-slate-100">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <DialogTitle className="text-xl text-slate-100">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400 text-base">
            {description}
          </DialogDescription>
          {itemName && (
            <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-300">
                <span className="text-slate-500">Deleting:</span>{" "}
                <span className="font-semibold">{itemName}</span>
              </p>
            </div>
          )}
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="text-white hover:bg-blue-700 bg-blue-500 transition-colors duration-300"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>

        {/* Warning message */}
        {!isDeleting && (
          <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-xs text-yellow-200">
              ⚠️ This will permanently delete the software and its image from
              the server.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
