import { Download, Users, MoreVertical, Trash2, Edit, Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Image from "next/image";
import { Software } from "@/types/software";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { formatPrice, formatRelativeTime } from "@/lib/utils";

interface SoftwareCardProps {
  software: Software;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  viewMode?: "grid" | "list";
}

export function SoftwareCard({
  software,
  onDelete,
  onEdit,
  viewMode = "grid",
}: SoftwareCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <Image
              src={software.imageUrl || "/placeholder.svg"}
              alt={software.name}
              className="w-20 h-20 rounded-lg object-cover bg-slate-800 flex-shrink-0"
              width={80}
              height={80}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100 text-lg">
                    {software.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-500/10 text-blue-400 border-blue-500/50 text-xs"
                  >
                    v{software.version}
                  </Badge>

                  {/* Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-slate-800 border-slate-700"
                    >
                      <DropdownMenuItem className="text-slate-300 hover:text-slate-100 hover:bg-slate-700 cursor-pointer">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-700" />
                      <DropdownMenuItem
                        onClick={() => onEdit?.(software.id)}
                        className="text-slate-300 hover:text-slate-100 hover:bg-slate-700 cursor-pointer"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(software.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-slate-700 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-2 line-clamp-2">
                {software.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-500/10 text-blue-400 border-blue"
                >
                  {software.category?.name || "Uncategorized"}
                </Badge>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  N/A
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  N/A
                </span>
                <span className="ml-auto text-slate-600">
                  {formatRelativeTime(software.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/50 transition-colors group">
      <CardContent className="p-4">
        <div className="relative">
          <Image
            src={software.imageUrl || "/placeholder.svg"}
            alt={software.name}
            className="w-full h-40 rounded-lg object-cover bg-slate-800 mb-4"
            width={400}
            height={160}
          />

          {/* Actions Button (shows on hover) */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-blue-600 border"
                >
                  <MoreVertical className="h-4 w-4 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-slate-800 border-slate-700"
              >
                <DropdownMenuItem className="text-slate-300 hover:text-slate-100 hover:bg-slate-700 cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                  onClick={() => onEdit?.(software.id)}
                  className="text-slate-300 hover:text-slate-100 hover:bg-slate-700 cursor-pointer"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(software.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-slate-700 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Price badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-600/90 text-white border-0">
              {formatPrice(software.price)}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-100 text-lg line-clamp-1">
              {software.name}
            </h3>
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-400 border-blue-500/50 text-xs flex-shrink-0"
            >
              v{software.version}
            </Badge>
          </div>
          <p className="text-sm text-slate-400 line-clamp-2">
            {software.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              N/A
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              N/A
            </span>
            <span className="ml-auto text-slate-600">
              {formatRelativeTime(software.createdAt)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-400 border-blue-500/50 text-xs flex-shrink-0"
        >
          {software.category?.name || "Uncategorized"}
        </Badge>
        <div className="flex items-center gap-2">
          {software.platform.slice(0, 2).map((p) => (
            <span key={p} className="text-xs text-slate-500">
              {p}
            </span>
          ))}
          {software.platform.length > 2 && (
            <span className="text-xs text-slate-500">
              +{software.platform.length - 2}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
