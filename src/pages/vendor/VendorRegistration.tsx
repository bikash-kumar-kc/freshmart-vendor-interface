import useVendorReigistration from "@/lib/tanstackquery/queryHook/useVendorReigistration";
import type { IApplyVendorPayload } from "@/types/vendor/vendor.public.type";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

const VendorRegistration = () => {
  const [open, setOpen] = useState<boolean>(false);

  const {
    mutate: vendorApply,
    data: vendorApplyResponse,
    isPending,
    isError,
    error,
    isSuccess,
  } = useVendorReigistration();

  // const handleVendorRegistration = async (data: IApplyVendorPayload) => {
  //   try {
  //     vendorApply(data);
  //   } catch (error) {
  //     console.log("Failed to vendor apply !");
  //     console.log(error);
  //   }
  // };

  const handleRegister = async () => {
    // Call your API
    // const res = await registerVendor();

    const success = true; // Replace with your API response

    if (success) {
      setOpen(true);
    }
  };

  return (
    <div>
      <Button onClick={handleRegister}>Apply for Vendor</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
          sm:max-w-md
    rounded-lg
    border-green-200
    [&_[data-slot='dialog-close']]:transition-colors
    [&_[data-slot='dialog-close']]:rounded-sm
    [&_[data-slot='dialog-close']:hover]:bg-red-50
    [&_[data-slot='dialog-close']:hover]:text-red-500
    border-none
    shadow-lg
    transition-shadow duration-200
    hover:shadow-xl
    "
        >
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center  rounded-full">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>

            {/* <DialogTitle className="text-center text-2xl font-bold text-green-700">
              Registration Successful
            </DialogTitle> */}

            <DialogDescription className="mt-1 mb-3 text-center text-gray-500 leading-relaxed text-[13px]">
              Your vendor application has been successfully registered.
              <br />
              An OTP has been sent to your email for verification.
            </DialogDescription>
          </DialogHeader>

          <Button className="w-full rounded-lg bg-green-600 transition-all duration-200 hover:bg-green-700 hover:shadow-md py-6 text-white tracking-wider">
            Verify Email
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorRegistration;
