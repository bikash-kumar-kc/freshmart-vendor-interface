import { useMutation } from "@tanstack/react-query";
import authServices from "@/api/auth/auth";

const usePasswordReset = () => {
  return useMutation({
    mutationFn: authServices.resetPassword,
  });
};

export default usePasswordReset;
