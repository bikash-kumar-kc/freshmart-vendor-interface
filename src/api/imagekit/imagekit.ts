import { toast } from "@/components/ui/toast";
import { api } from "../axios";

interface IImageKitType {
  token: string;
  expire: string;
  signature: string;
  publicKey: string;
}

class ImagekitServices {
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

  async deleteFile(fileId: string) {
  
    if (!fileId) return;

    try {
      await api.delete(`/imagekit/${fileId}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.add({ type: "error", description: error.message });
        return;
      }

      toast.add({ type: "error", description: "Failed to delete image" });

      throw error;
    }
  }

  async deleteFiles(fileIds: string[]) {
    if (!fileIds || fileIds.length === 0) return;

    try {
      await api.delete(`/imagekit/deletefiles`, {
        data: {
          fileIds: fileIds,
        },
      });
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
