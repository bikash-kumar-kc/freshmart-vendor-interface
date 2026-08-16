import { useEffect, useState } from "react";
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
import {
  RegistrationSuccessDialog,
  VerifyEmailDialog,
} from "./RegistrationSuccessDialog";
import { showToast } from "@/components/ReactToast";
import Motion from "@/components/motion/Motion";

export default function VendorRegistrationPage() {
  const navigate = useNavigate();
  const {
    mutate: vendorApply,
    data: vendorReplyData,
    isPending,
  } = useVendorReigistration();

  const [open, setOpen] = useState<boolean>(false);
  const [verifyEmail, setVerifyEmail] = useState<boolean>(false);

  const [activeField, setActiveField] = useState<string | null>(null);

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

      const response = await imagekitservice.generateAuthParams();

      if (!response) {
        throw new Error("Failed to get Imagekit auth params");
      }

      const authparams = response;

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
        showToast.error(error.message);
        return;
      }

      showToast.error("Failed to upload image");
    }
  };

  const handleFileDelete = async (fileId: string) => {
    if (!fileId) {
      showToast.error("File id is Required !");
      return;
    }

    try {
      await imagekitservice.deleteFile(fileId);

      showToast.success("File deleted successfully");
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

      showToast.success("Registration Form", "Registration Form Submitted.");
      reset();
      setCertificatePreviews([]);
      setCertificates([]);
      setPanVatCertificate(null);
      setPanVatPreview(null);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (vendorReplyData) {
      setSubmitted({ email: vendorReplyData.email });
      setOpen(true);
    }
  }, [vendorReplyData, certificates, panVatCertificate, submitted?.email]);

  return (
    <div className="min-h-screen bg-amber-50 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
        <Motion>
          <Link to="/">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">🌿</span>

              <h2 className="text-2xl font-semibold tracking-wider text-black">
                FreshMart
              </h2>
            </div>
          </Link>
        </Motion>

        <Motion>
          <div className="mb-6 ">
            <h1 className="text-xl font-semibold text-slate-900">
              Become a vendor
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Tell us about your farm. Our team reviews every application and
              verifies your PAN/VAT certificate before approval.
            </p>
          </div>
        </Motion>

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

      <RegistrationSuccessDialog
        open={open}
        setOpen={setOpen}
        onVerifyClick={() => {
          setVerifyEmail(true);
          setOpen(false);
        }}
      />

      <VerifyEmailDialog
        verifyEmail={verifyEmail}
        setVerifyEmail={setVerifyEmail}
        submitted={submitted}
      />
    </div>
  );
}
