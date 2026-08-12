import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../setup/queryKeys";
import vendorService from "@/api/vendor/vendor";

const useVendorReigistration = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.vendorRegistration],
    mutationFn: vendorService.vendorApply,
  });
};

export default useVendorReigistration;
