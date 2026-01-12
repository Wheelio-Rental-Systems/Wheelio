import { useState } from "react";
import { Upload, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

export function DamageReport() {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const handleUpload = (e) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  return (
    <div className="container px-4 py-8 max-w-2xl">
      <h1 className="text-3xl mb-2 text-primary">Report Vehicle Damage</h1>
      <p className="text-muted-foreground mb-6">
        Report any scratches, dents, or issues found after your trip
      </p>

      <div className="space-y-5">
        {/* Description */}
        <div>
          <label className="text-sm">Damage Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the damage clearly..."
            className="w-full mt-2 p-3 rounded-lg bg-muted border border-border text-white"
            rows={4}
          />
        </div>

        {/* Upload */}
        <div>
          <label className="text-sm">Upload Damage Photos</label>
          <label className="mt-2 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
            <Upload />
            <span className="text-sm text-muted-foreground">
              Click to upload images
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleUpload}
            />
          </label>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/40 p-3 rounded-lg">
          <AlertTriangle className="h-4 w-4 mt-0.5" />
          Damage charges will be calculated after inspection by staff.
        </div>

        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500">
          Submit Damage Report
        </Button>
      </div>
    </div>
  );
}
