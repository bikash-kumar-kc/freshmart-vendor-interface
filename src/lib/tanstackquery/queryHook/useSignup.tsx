import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../setup/queryKeys";
import authServices from "@/api/auth/auth";

const useSignup = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.signup],
    mutationFn: authServices.create,
  });
};

export default useSignup;
