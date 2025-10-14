import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Software, CreateSoftwarePayload } from "@/types/software";

//! Fetch all software
export function useSoftware() {
  return useQuery<Software[]>({
    queryKey: ["software"],
    queryFn: async () => {
      const res = await fetch("/api/software");
      if (!res.ok) throw new Error("Failed to fetch software");
      return res.json();
    },
  });
}

//! Create software mutation
export function useCreateSoftware() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSoftwarePayload) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("version", data.version);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("platform", JSON.stringify(data.platform));

      // Append new optional fields
      if (data.webUrl) {
        formData.append("webUrl", data.webUrl);
      }
      console.log(
        "Hook CREATE SOFTWARE - data.tags:",
        data.tags,
        "Type:",
        typeof data.tags
      );
      // Always append tags field, even if empty (to allow clearing)
      let tagsToSend = "";
      if (data.tags) {
        if (typeof data.tags === "string" && data.tags.trim().length > 0) {
          tagsToSend = data.tags;
        } else if (Array.isArray(data.tags) && data.tags.length > 0) {
          tagsToSend = data.tags.join(", ");
        }
      }
      console.log("Hook CREATE - Sending tags:", tagsToSend);
      formData.append("tags", tagsToSend);

      if (data.repoUrl) {
        formData.append("repoUrl", data.repoUrl);
      }
      if (data.downloadUrl) {
        formData.append("downloadUrl", data.downloadUrl);
      }

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await fetch("/api/software", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create software");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch software list
      queryClient.invalidateQueries({ queryKey: ["software"] });
    },
  });
}

//! Update software mutation
export function useUpdateSoftware() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CreateSoftwarePayload;
    }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("version", data.version);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("platform", JSON.stringify(data.platform));

      // Append new optional fields
      if (data.webUrl) {
        formData.append("webUrl", data.webUrl);
      }
      // Always append tags field, even if empty (to allow clearing)
      console.log(
        "Hook UPDATE - data.tags:",
        data.tags,
        "Type:",
        typeof data.tags
      );

      let tagsToSend = "";
      if (data.tags) {
        if (typeof data.tags === "string" && data.tags.trim().length > 0) {
          tagsToSend = data.tags;
        } else if (Array.isArray(data.tags) && data.tags.length > 0) {
          tagsToSend = data.tags.join(", ");
        }
      }

      console.log("Hook UPDATE - Sending tags:", tagsToSend);
      formData.append("tags", tagsToSend);
      if (data.repoUrl) {
        formData.append("repoUrl", data.repoUrl);
      }
      if (data.downloadUrl) {
        formData.append("downloadUrl", data.downloadUrl);
      }

      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await fetch(`/api/software/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update software");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["software"] });
    },
  });
}

//! Delete software mutation
export function useDeleteSoftware() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/software/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete software");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["software"] });
    },
  });
}
