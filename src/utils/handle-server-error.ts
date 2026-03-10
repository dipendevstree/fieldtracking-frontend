import { AxiosError } from "axios";
import { toast } from "sonner";
import { TOAST_CONFIG } from "@/config/toastConfig";

export function handleServerError(error: unknown) {
  // eslint-disable-next-line no-console
  console.log(error);

  let errMsg = "Something went wrong!";

  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    Number(error.status) === 204
  ) {
    errMsg = "Content not found.";
  }

  if (error instanceof AxiosError) {
    errMsg = error.response?.data.title;
  }

  toast.error(errMsg, {
    duration: TOAST_CONFIG.duration,
    position: TOAST_CONFIG.position,
  });
}
