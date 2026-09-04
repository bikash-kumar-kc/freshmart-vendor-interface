import { showToast } from "@/components/ReactToast";

export function handleApiError(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response: { data: { message: string } } })
      .response;
    const message = response?.data?.message;

    if (Array.isArray(message)) {
      message.forEach((m: string) => showToast.error(m));
    } else if (typeof message === "string") {
      showToast.error(message);
    } else {
      showToast.error("Something went wrong. Please try again.");
    }
    return;
  }

  showToast.error("Network error", "Please check your connection.");
}
