import { useMutation } from "@tanstack/react-query";
import authServices from "@/api/auth/auth";

const useRequestForPasswordReset = () => {
  return useMutation({
    mutationFn: authServices.requestPasswordReset,
  });
};

export default useRequestForPasswordReset;
