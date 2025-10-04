"use client"

import type React from "react"

import { useState } from "react"
import { Upload, ImageIcon, CheckCircle } from "lucide-react"
import { DashboardHeader } from "@/app/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"

export default function UploadPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    version: "",
    category: "",
    price: "",
    platform: [] as string[],
  })
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    setUploadSuccess(true)
    setTimeout(() => {
      setUploadSuccess(false)
      setFormData({
        name: "",
        description: "",
        version: "",
        category: "",
        price: "",
        platform: [],
      })
    }, 3000)
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold text-blue-400 mb-2">Upload Software</h1>
              <p className="text-slate-400">Add new software to your library</p>
            </div>

            {/* Success Message */}
            {uploadSuccess && (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="text-green-400">Software uploaded successfully!</p>
              </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Software Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter software name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version" className="text-slate-300">
                    Version *
                  </Label>
                  <Input
                    id="version"
                    placeholder="e.g., 1.0.0"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the software features and benefits..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-slate-100 min-h-[120px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-300">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="productivity">Productivity</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-slate-300">
                    Price (USD)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0 for free"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Platform *</Label>
                <div className="flex gap-6">
                  {["Windows", "Mac", "Linux"].map((platform) => (
                    <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.platform.includes(platform)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, platform: [...formData.platform, platform] })
                          } else {
                            setFormData({ ...formData, platform: formData.platform.filter((p) => p !== platform) })
                          }
                        }}
                        className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-300">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Software Image *</Label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <ImageIcon className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Download File *</Label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 mb-1">Click to upload software file</p>
                  <p className="text-xs text-slate-500">ZIP, EXE, DMG, etc. (Max 500MB)</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  Save as Draft
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Software
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
