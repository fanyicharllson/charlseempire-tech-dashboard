"use client";

import {
  X,
  Download,
  Users,
  Package,
  Calendar,
  DollarSign,
  Tag,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Image from "next/image";
import type { Software } from "@/types/software";
import { formatRelativeTime, formatPrice } from "@/lib/utils";

interface SoftwareDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  software: Software | null;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function SoftwareDetailModal({
  open,
  onOpenChange,
  software,
  showActions = true,
  onEdit,
  onDelete,
}: SoftwareDetailModalProps) {
  if (!software) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] bg-slate-900 border-slate-700 text-slate-100 p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{software.name}</DialogTitle>
        </DialogHeader>

        {/* Image Header */}
        <div className="relative h-64 bg-slate-800">
          <Image
            src={software.imageUrl || "/placeholder.svg"}
            alt={software.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-900/80 hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-slate-300" />
          </button>

          {/* Price Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-blue-600 text-white border-0 text-lg px-3 py-1">
              {formatPrice(software.price)}
            </Badge>
          </div>

          {/* Title & Version at bottom */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  {software.name}
                </h2>
                <Badge
                  variant="outline"
                  className="bg-blue-500/20 text-blue-300 border-blue-500/50"
                >
                  v{software.version}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <Download className="h-5 w-5 text-blue-400 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Downloads</p>
              <p className="text-sm font-semibold text-slate-200">N/A</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <Users className="h-5 w-5 text-green-400 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Users</p>
              <p className="text-sm font-semibold text-slate-200">N/A</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <Calendar className="h-5 w-5 text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Added</p>
              <p className="text-sm font-semibold text-slate-200">
                {formatRelativeTime(software.createdAt)}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-400" />
              Description
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {software.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="bg-slate-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-500">Category</span>
              </div>
              <p className="text-slate-200 font-medium">
                {software.category?.name || "Uncategorized"}
              </p>
            </div>

            {/* Price */}
            <div className="bg-slate-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="text-xs text-slate-500">Price</span>
              </div>
              <p className="text-slate-200 font-medium">
                {formatPrice(software.price)}
              </p>
            </div>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">
              Available Platforms
            </h3>
            <div className="flex gap-2">
              {software.platform.map((platform) => (
                <Badge
                  key={platform}
                  variant="outline"
                  className="bg-slate-800/50 border-slate-700 text-slate-300"
                >
                  {platform}
                </Badge>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-slate-700/50 text-xs text-slate-500 space-y-1">
            <p>Software ID: {software.id}</p>
            <p>Slug: /{software.slug}</p>
            <p>Last Updated: {formatRelativeTime(software.updatedAt)}</p>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  onEdit?.(software.id);
                  onOpenChange(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Edit Software
              </Button>
              <Button
                onClick={() => {
                  onDelete?.(software.id);
                  onOpenChange(false);
                }}
                className="flex-1 border-red-500 bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
