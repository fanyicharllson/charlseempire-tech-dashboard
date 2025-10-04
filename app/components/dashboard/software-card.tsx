import { Download, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Image from "next/image";

interface SoftwareCardProps {
  name: string;
  description: string;
  version: string;
  category: string;
  downloads: number;
  users: number;
  imageUrl: string;
  viewMode?: "grid" | "list";
}

export function SoftwareCard({
  name,
  description,
  version,
  category,
  downloads,
  users,
  imageUrl,
  viewMode = "grid",
}: SoftwareCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              className="w-20 h-20 rounded-lg object-cover bg-slate-800 flex-shrink-0"
              width={80}
              height={80}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-slate-100 text-lg">{name}</h3>
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-blue-400 border-blue-500/50 text-xs ml-2"
                >
                  v{version}
                </Badge>
              </div>
              <p className="text-sm text-slate-400 mb-2">{description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <Badge
                  variant="outline"
                  className="text-xs bg-slate-800/50 border-slate-700"
                >
                  {category}
                </Badge>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {downloads.toLocaleString()} downloads
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {users.toLocaleString()} users
                </span>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/50 transition-colors">
      <CardContent className="p-4">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-full h-40 rounded-lg object-cover bg-slate-800 mb-4"
          width={400}
          height={160}
        />
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-slate-100 text-lg">{name}</h3>
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-400 border-blue-500/50 text-xs"
            >
              v{version}
            </Badge>
          </div>
          <p className="text-sm text-slate-400 line-clamp-2">{description}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {downloads.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {users.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Badge
          variant="outline"
          className="text-xs bg-slate-800/50 border-slate-700"
        >
          {category}
        </Badge>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
