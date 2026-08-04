import { useEffect, useRef, useState, type RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, X, CheckCircle2, Plus } from "lucide-react";
import useVendorReigistration from "@/lib/tanstackquery/queryHook/useVendorReigistration";
import {
  vendorRegistrationSchema,
  type VendorRegistrationFormValues,
} from "@/lib/validation/vendor.validation.schema";
import { SectionCard } from "@/components/reuseableComponents/SectionCard";
import { Field } from "@/components/reuseableComponents/Field";
import { getInputClass } from "@/lib/reuseablestyle/reuseablestyle";
import { FileUploadBox } from "@/components/reuseableComponents/FileUpload";
import imagekitservice from "@/api/imagekit/imagekit";
import { upload } from "@imagekit/react";
import { config } from "@/config/config";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import authServices from "@/api/auth/auth";
import axios from "axios";

interface IAuthParam {
  token: string;
  signature: string;
  expire: string;
}

export default function VendorRegistrationPage() {
  const navigate = useNavigate();
  const {
    mutate: vendorApply,
    data: vendorReplyData,
    isPending,
  } = useVendorReigistration();

  const [otp, setOtp] = useState("");

  const [count, setCount] = useState<number>(0);

  const [open, setOpen] = useState<boolean>(false);
  const [verifyEmail, setVerifyEmail] = useState<boolean>(false);

  const [activeField, setActiveField] = useState<string | null>(null);
  const [authparams, setAuthParams] = useState<IAuthParam>();

  const [panVatCertificate, setPanVatCertificate] = useState<Record<
    string,
    string
  > | null>(null);
  const [panVatPreview, setPanVatPreview] = useState<Record<
    string,
    string
  > | null>(null);

  const [certificates, setCertificates] = useState<Record<string, string>[]>(
    [],
  );
  const [certificatePreviews, setCertificatePreviews] = useState<
    (Record<string, string> | null)[]
  >([]);

  const [submitted, setSubmitted] = useState<{ email: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VendorRegistrationFormValues>({
    resolver: zodResolver(vendorRegistrationSchema),
  });

  async function removeCertificate(fileId: string) {
    await handleFileDelete(fileId);
    setCertificates((prev) => prev.filter((f) => f.fileId !== fileId));
    setCertificatePreviews((prev) =>
      prev
        ? prev.filter(
            (f) => (f as { blob: string; fileId: string }).fileId !== fileId,
          )
        : prev,
    );
  }

  const handleImagePreview = (
    file: File,
    type: "multiple" | "single",
    fileId: string,
  ) => {
    if (type === "multiple" && file.type.startsWith("image/"))
      setCertificatePreviews((prev) => [
        ...prev,
        {
          blob: URL.createObjectURL(file),
          fileId: fileId,
        },
      ]);

    if (type === "single" && file.type.startsWith("image/"))
      setPanVatPreview({
        blob: URL.createObjectURL(file),
        fileId: fileId,
      });
  };

  const handleUploadFiles = async (file: File, type: "multiple" | "single") => {
    try {
      if (!file) return;

      // let auths: IAuthParam;

      // if (!authparams) {
      const response = await imagekitservice.generateAuthParams();

      if (!response) {
        throw new Error("Failed to get Imagekit auth params");
      }

      const authparams = response;

      // setAuthParams(auths);
      // }

      const uploadOptions = {
        file,
        fileName: file.name,
        token: authparams.token,
        signature: authparams.signature,
        expire: Number(authparams.expire),
        publicKey: config.publicKey,
      };

      const res = await upload({ ...uploadOptions });
      const imageUrl = res.url;
      const fileId = res.fileId;

      if (type === "multiple") handleImagePreview(file, "multiple", fileId!);

      if (type === "single") handleImagePreview(file, "single", fileId!);

      if (imageUrl && fileId && type === "multiple") {
        setCertificates((prevs) => [
          ...prevs,
          {
            url: imageUrl,
            fileId: fileId,
          },
        ]);
        return;
      }

      if (imageUrl && type === "single" && fileId) {
        setPanVatCertificate({ url: imageUrl, fileId });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.add({ type: "error", description: error.message });
        return;
      }
      toast.add({ type: "error", description: "Failed to upload image" });
    }
  };

  const handleFileDelete = async (fileId: string) => {
    if (!fileId) {
      toast.add({ type: "error", description: "File Id is required !" });
      return;
    }

    try {
      const response = await imagekitservice.deleteFile(fileId);
      toast.add({ type: "success", description: "File deleted successfully" });
    } catch {
      console.log("Failed to delete file !");
    }
  };

  const handleMultiplFileDelete = async (fileIds: string[]) => {
    if (fileIds.length === 0) {
      return;
    }

    try {
      await imagekitservice.deleteFiles(fileIds);
    } catch {
      localStorage.setItem("ImageUrls", fileIds.join(","));
    }
  };

  async function onSubmit(values: VendorRegistrationFormValues) {
    try {
      const isPanVatExist = !!panVatCertificate;
      if (!isPanVatExist) {
        return;
      }

      vendorApply({
        ...values,
        panVatCertificateUrl: panVatCertificate.url,
        certificates: certificates.map((c) => c.url) ?? undefined,
      });

      toast.add({
        type: "success",
        title: "Registration Form",
        description: "Registration Form Submitted",
      });

      reset();
      setCertificatePreviews([]);
      setCertificates([]);
      setPanVatCertificate(null);
      setPanVatPreview(null);
    } catch (error) {
      console.log(error);
    }
  }

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [openResend, setOpenResend] = useState(false);
  const handleTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setOpenResend(true);
    }, 1000);
  };

  const [rateLimit, setRateLimit] = useState(false);

  useEffect(() => {
    if (vendorReplyData) {
      setSubmitted({ email: vendorReplyData.email });
      setOpen(true);
    }
    // return () => {
    //   if (!submitted?.email) {
    //     const fieldIds =
    //       certificates.length > 0 ? certificates.map((c) => c.fieldId) : [];
    //     if (panVatCertificate) fieldIds.push(panVatCertificate.fieldId);
    //     handleMultiplFileDelete(fieldIds);
    //   } else {
    //     setPanVatCertificate(null);
    //     setPanVatPreview(null);
    //     setCertificatePreviews([]);
    //     setCertificates([]);
    //   }
    // };
  }, [vendorReplyData, certificates, panVatCertificate, submitted?.email]);

  return (
    <div className="min-h-screen bg-amber-50 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
        <Link to="/">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">🌿</span>

            <h2 className="text-2xl font-semibold tracking-wider text-black">
              FreshMart
            </h2>
          </div>
        </Link>

        <div className="mb-6 ">
          <h1 className="text-xl font-semibold text-slate-900">
            Become a vendor
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tell us about your farm. Our team reviews every application and
            verifies your PAN/VAT certificate before approval.
          </p>
        </div>

        {submitted && (
          <div className="mb-6 flex items-start gap-2.5 rounded-sm border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Application submitted</p>
              <p className="text-primary/80 mt-0.5">
                We'll email you at {submitted.email} once it's reviewed.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <SectionCard
            step={1}
            title="Farm details"
            description="Basic information about the farm you're registering."
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                name="farmName"
                label="Farm name"
                required
                error={errors.farmName?.message}
                activeField={activeField}
                setActiveField={setActiveField}
              >
                <input
                  {...register("farmName")}
                  className={getInputClass(!!errors.farmName)}
                  placeholder="e.g. Green Valley Farm"
                />
              </Field>

              <Field
                name="farmOriginCountry"
                label="Farm origin country"
                required
                error={errors.farmOriginCountry?.message}
                activeField={activeField}
                setActiveField={setActiveField}
              >
                <input
                  {...register("farmOriginCountry")}
                  className={getInputClass(!!errors.farmOriginCountry)}
                  placeholder="e.g. Nepal"
                />
              </Field>

              <Field
                name="farmOwner"
                label="Farm owner"
                required
                error={errors.farmOwner?.message}
                activeField={activeField}
                setActiveField={setActiveField}
              >
                <input
                  {...register("farmOwner")}
                  className={getInputClass(!!errors.farmOwner)}
                  placeholder="Full name"
                />
              </Field>

              <Field
                name="phoneNumber"
                label="Phone number"
                required
                error={errors.phoneNumber?.message}
                activeField={activeField}
                setActiveField={setActiveField}
              >
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className={getInputClass(!!errors.phoneNumber)}
                  placeholder="your personal number..."
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field
                name="addressLocation"
                label="Address / farm location"
                required
                error={errors.addressLocation?.message}
                activeField={activeField}
                setActiveField={setActiveField}
              >
                <input
                  {...register("addressLocation")}
                  className={getInputClass(!!errors.addressLocation)}
                  placeholder="Ward, municipality, district"
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field
                name="farmDescription"
                label="Farm description"
                error={errors.farmDescription?.message}
                activeField={activeField}
                setActiveField={setActiveField}
              >
                <textarea
                  rows={4}
                  {...register("farmDescription")}
                  className={getInputClass(!!errors.farmDescription)}
                  placeholder="Growing practices, specialties, years in operation..."
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            step={2}
            title="Contact & tax details"
            description="How we reach you and your tax registration."
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                name="email"
                label="Email"
                required
                error={errors.email?.message}
                activeField={activeField}
                setActiveField={setActiveField}
              >
                <input
                  type="email"
                  {...register("email")}
                  className={getInputClass(!!errors.email)}
                  placeholder="you@farm.com"
                />
              </Field>

              <Field
                name="vatNumber"
                label="VAT number"
                required
                error={errors.vatNumber?.message}
                activeField={activeField}
                setActiveField={setActiveField}
              >
                <input
                  {...register("vatNumber")}
                  className={getInputClass(!!errors.vatNumber)}
                  placeholder="e.g. 600XXXXXX"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            step={3}
            title="Verification documents"
            description="Required for admin approval."
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  PAN/VAT certificate
                  <span className="text-rose-500 ml-0.5">*</span>
                </label>
                <FileUploadBox
                  label="Upload PAN/VAT certificate (PDF or image)"
                  previewUrl={panVatPreview ? panVatPreview.blob : ""}
                  onSelect={(file: File) => handleUploadFiles(file, "single")}
                  onRemove={async () => {
                    await handleFileDelete(
                      panVatPreview ? panVatPreview.fileId : "",
                    );
                    setPanVatCertificate(null);
                    setPanVatPreview(null);
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Organic Certified Certificate
                </label>
                <div className="space-y-2">
                  {certificates.map((f, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-sm p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          {certificatePreviews[idx] ? (
                            <img
                              src={certificatePreviews[idx].blob!}
                              alt={f.fieldId}
                              className="w-12 h-12 object-cover rounded-sm border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-sm bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          <span className="text-sm text-slate-700 truncate">
                            {f.fieldId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCertificate(f.fileId)}
                          className="text-slate-300 hover:text-rose-500 shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <label className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 cursor-pointer w-fit">
                    <Plus className="w-4 h-4" />
                    Add Organic Certified Certificate
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUploadFiles(f, "multiple");
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="flex items-center justify-end gap-3 pb-10">
            <button
              type="button"
              onClick={() => {
                if (!submitted?.email) {
                  const fieldIds =
                    certificates.length > 0
                      ? certificates.map((c) => c.fieldId)
                      : [];
                  if (panVatCertificate)
                    fieldIds.push(panVatCertificate.fieldId);
                  handleMultiplFileDelete(fieldIds);
                }
                navigate("/");
              }}
              className="px-8 py-2.5 rounded-sm text-sm font-medium text-white bg-red-500 hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-sm text-sm font-medium bg-green-500 text-white hover:bg-green-700 disabled:opacity-60 transition-colors"
            >
              {isPending ? "Submitting..." : "Submit application"}
            </button>
          </div>
        </form>
      </div>

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

          <Button
            className="w-full rounded-lg bg-green-600 transition-all duration-200 hover:bg-green-700 hover:shadow-md py-6 text-white tracking-wider"
            onClick={() => {
              setVerifyEmail(true);
              setOpen(false);
            }}
          >
            Verify Email
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={verifyEmail} onOpenChange={setVerifyEmail}>
        <DialogContent
          className="
      sm:max-w-md
      rounded-lg
      border-none
      shadow-lg
      transition-shadow
      duration-200
      hover:shadow-xl
      p-8
      [&_[data-slot='dialog-close']]:rounded-sm
      [&_[data-slot='dialog-close']]:transition-colors
      [&_[data-slot='dialog-close']:hover]:bg-red-50
      [&_[data-slot='dialog-close']:hover]:text-red-500
    "
        >
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-center text-2xl font-semibold tracking-wider text-gray-900">
              Verify your email
            </DialogTitle>

            <DialogDescription className="text-center text-[12px] leading-6 tracking-wider text-muted-foreground">
              Enter the 6-digit verification code sent to your email.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-4">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="
                h-12
                w-12
                rounded-md
                border-green-200
                bg-green-50
                text-lg
                font-semibold
                text-green-700
                transition-all
                duration-200
                
                data-[active=true]:ring-2
                data-[active=true]:ring-green-200
              "
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            className="
        h-12
        w-full
        rounded-lg
        bg-green-600
        text-base
        font-medium
        tracking-wide
        text-white
        transition-all
        duration-200
        hover:bg-green-700
        hover:shadow-md
      "
            disabled={rateLimit}
            onClick={async () => {
              if (!otp || !submitted?.email) return;
              console.log("sfisjdoiffffffff");
              try {
                await authServices.verifyOtp({
                  email: submitted.email,
                  otp,
                });

                setVerifyEmail(false)

                toast.add({
                  type: "success",
                  title: "Email Verify",
                  description: "Your email is verified successfully ",
                });
              } catch (error) {
                console.log(error);
                if (axios.isAxiosError(error)) {
                  const { status } = error.response;
                  console.log("status", status);

                  if (status === 400) {
                    handleTimer();
                    setOtp("");
                    toast.add({ type: "error", title: "otp not matched" });
                  }

                  if (status === 429) {
                    setRateLimit(true);
                    toast.add({
                      type: "error",
                      title: "rate limit hit",
                      description:
                        "you have to wait for some minute beforing trying !",
                    });
                  }
                }
              }
            }}
          >
            Verify OTP
          </Button>

          {openResend && (
            <Button
              className="
        h-12
        w-full
        rounded-lg
        bg-green-600
        text-base
        font-medium
        tracking-wide
        text-white
        transition-all
        duration-200
        hover:bg-green-700
        hover:shadow-md
      "
              disabled={!openResend}
              onClick={async () => {
                try {
                  if (!submitted?.email) {
                    console.log("No email");
                    return;
                  }
                  await authServices.resendOtp({ email: submitted.email });
                } catch (error) {
                  if (axios.isAxiosError(error)) {
                    if (error.response?.status === 429) {
                      setRateLimit(true);
                      toast.add({
                        type: "error",
                        title: "rate limit hit",
                        description:
                          "you have to wait for some minute beforing trying !",
                      });
                    }
                    return;
                  }

                  toast.add({
                    type: "error",
                    description: "Failed to generate otp",
                  });
                }
              }}
            >
              resend otp
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
