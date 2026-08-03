import { toast } from "@/components/ui/toast";

export function handleApiError(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response: { data: { message: string } } })
      .response;
    const message = response?.data?.message;

    if (Array.isArray(message)) {
      message.forEach((m: string) =>
        toast.add({ type: "error", title: "Error", description: m }),
      );
    } else if (typeof message === "string") {
      toast.add({ type: "error", title: "Error", description: message });
    } else {
      toast.add({
        type: "error",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
    return;
  }

  toast.add({
    type: "error",
    title: "Network error",
    description: "Please check your connection.",
  });
}
