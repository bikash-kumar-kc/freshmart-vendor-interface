
import { showToast } from "@/components/ReactToast";
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
        showToast.error(error.message);
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
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(error.message);
        return;
      }
      showToast.error("Failed to delete image");
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

    } catch (error) {
      if (error instanceof Error) {
        showToast.error(error.message);
        return;
      }
      showToast.error("Failed to delete images");
    }
  }
}

const imagekitservice = new ImagekitServices();

export default imagekitservice;
