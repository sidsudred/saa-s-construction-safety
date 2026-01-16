"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, FileImage, Video, File } from "lucide-react"

interface Evidence {
  id: string
  name: string
  type: "image" | "video" | "file"
  size: string
  url: string
}

export function EvidenceUploader() {
  const [files, setFiles] = useState<Evidence[]>([
    {
      id: "1",
      name: "site-photo-001.jpg",
      type: "image",
      size: "2.4 MB",
      url: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      name: "incident-video.mp4",
      type: "video",
      size: "15.8 MB",
      url: "",
    },
  ])

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id))
  }

  const getFileIcon = (type: Evidence["type"]) => {
    switch (type) {
      case "image":
        return <FileImage className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence & Attachments</CardTitle>
        <CardDescription>Upload photos, videos, and documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 text-center">
          <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">Images, videos, PDFs (max 50MB each)</p>
          <Button className="mt-4" size="sm">
            Browse Files
          </Button>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile(file.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
