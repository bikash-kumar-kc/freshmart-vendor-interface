import { toast } from "@/components/ui/toast";
import { api } from "../axios";

interface IImageKitType {
  token: string;
  expire: string;
  signature: string;
  publicKey: string;
}

class ImagekitServices {
  // imagekit auth params...
  async generateAuthParams() {
    try {
      const response = await api.get<IImageKitType>("/imagekit");

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.add({ type: "error", description: error.message });
      }

      console.log("Failed to get auth params : [Imagekit]");
      console.log(error);
    }
  }

  // delete file...
  async deleteFile(fileId: string) {
    if (!fileId) return;
    try {
      await api.delete(`/imagekit/${fileId}`);
      // toast.add({ type: "success", description: "Image deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        toast.add({ type: "error", description: error.message });
        return;
      }
      toast.add({ type: "error", description: "Failed to delete image" });
      throw error;
    }
  }

  // delete multiple files...
  async deleteFiles(fileIds: string[]) {
    if (!fileIds || fileIds.length === 0) return;
    console.log(fileIds);

    try {
      await api.delete(`/imagekit/files`, {
        data: {
          fileIds: fileIds,
        },
      });
      // toast.add({
      //   type: "success",
      //   description: "Multiple delete successfully",
      // });
    } catch (error) {
      if (error instanceof Error) {
        toast.add({ type: "error", description: error.message });
        return;
      }
      toast.add({ type: "error", description: "Failed to delete images" });
    }
  }
}

const imagekitservice = new ImagekitServices();

export default imagekitservice;
