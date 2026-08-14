import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../setup/queryKeys";
import authServices from "@/api/auth/auth";

const useSignin = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.signin],
    mutationFn: authServices.login,
    retry:1
  });
};

export default useSignin;
