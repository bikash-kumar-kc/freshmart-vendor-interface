import { useState } from "react";
import { UploadCloud, X } from "lucide-react";
// import { toast } from "@/components/ui/toast";
import type { IUploadedImage } from "@/types/productListing/productListing.type";
import imagekitservice from "@/api/imagekit/imagekit";
import { Image, upload } from "@imagekit/react";
import { config } from "@/config/config";
import ImagekitProviderParent from "@/providers/ImagekitProvider";
import { showToast } from "./ReactToast";

interface ReusableImageUploaderProps {
  images: IUploadedImage[];
  onImagesChange: (images: IUploadedImage[]) => void;
  multiple?: boolean;
  label?: string;
}

interface IUploadingFile {
  tempId: string;
  fileName: string;
  progress: number; // 0-100
}

export default function ReusableImageUploader({
  images,
  onImagesChange,
  multiple = true,
  label = "Upload",
}: ReusableImageUploaderProps) {
  const [uploadingFiles, setUploadingFiles] = useState<IUploadingFile[]>([]);

  const updateProgress = (tempId: string, progress: number) => {
    setUploadingFiles((prev) =>
      prev.map((f) => (f.tempId === tempId ? { ...f, progress } : f)),
    );
  };

  const removeFromUploading = (tempId: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.tempId !== tempId));
  };

  const handleUploadFiles = async (file: File) => {
    if (!file) return;

    const tempId = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setUploadingFiles((prev) => [
      ...prev,
      { tempId, fileName: file.name, progress: 0 },
    ]);

    try {
      const authparams = await imagekitservice.generateAuthParams();
      if (!authparams) throw new Error("Failed to get Imagekit auth params");

      const res = await upload({
        file,
        fileName: file.name,
        token: authparams.token,
        signature: authparams.signature,
        expire: Number(authparams.expire),
        publicKey: config.publicKey,
        onProgress: (event) => {
          const percent =
            event.total > 0
              ? Math.round((event.loaded / event.total) * 100)
              : 0;
          updateProgress(tempId, percent);
        },
      });

      const imageUrl = res.url;
      const fileId = res.fileId;

      if (imageUrl && fileId) {
        onImagesChange(
          multiple
            ? [...images, { url: imageUrl, fileId }]
            : [{ url: imageUrl, fileId }],
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(error.message);
      } else {
        showToast.error("Failed to upload image");
      }
    } finally {
      removeFromUploading(tempId);
    }
  };

  const handleRemoveImage = async (fileId: string) => {
    onImagesChange(images.filter((img) => img.fileId !== fileId));
    try {
      await imagekitservice.deleteFile(fileId);
      showToast.success("Image deleted successfully ");
    } catch {
      console.log("Failed to delete file from ImageKit — orphaned remotely.");
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {images.map((img) => (
        <div
          key={img.fileId}
          className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 group"
        >
          <ImagekitProviderParent>
            <Image
              src={img.url}
              width={500}
              height={500}
              alt="product listing image"
            />
          </ImagekitProviderParent>
          <button
            type="button"
            onClick={() => handleRemoveImage(img.fileId)}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}

      {uploadingFiles.map((f) => (
        <div
          key={f.tempId}
          className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1.5 px-2"
        >
          <span className="text-[10px] text-slate-500 truncate w-full text-center">
            {f.fileName}
          </span>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3B6D11] transition-all duration-150 ease-out"
              style={{ width: `${f.progress}%` }}
            />
          </div>
          <span className="text-[10px] font-medium text-slate-600">
            {f.progress}%
          </span>
        </div>
      ))}

      <label className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-[#3B6D11] hover:border-[#3B6D11] cursor-pointer bg-green-50 transition-colors">
        <UploadCloud className="w-5 h-5" />
        <span className="text-[10px]">{label}</span>
        <input
          type="file"
          accept="application/pdf,image/*"
          className="hidden"
          multiple={multiple}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            files.forEach((f) => handleUploadFiles(f));
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
