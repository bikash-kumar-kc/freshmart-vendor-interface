import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus, Trash2 } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import type {
  ICreateVariantPayload,
  IUploadedImage,
} from "@/types/productListing/productListing.type";
import {
  useCategories,
  useMeasurementTypes,
  usePackagingTypes,
  useProductNames,
} from "@/lib/tanstackquery/productlisting/lookup.queries";
import { useCreateProductListing } from "@/lib/tanstackquery/productlisting/product-listing.queries";
import {
  productListingSchema,
  type ProductListingFormValues,
} from "@/lib/validation/productListing.validation";
import imagekitservice from "@/api/imagekit/imagekit";
import PageHeading from "@/components/PagingHeading";
import { Field } from "@/components/reuseableComponents/Field";
import ReusableCombobox from "@/components/ReuseableComobox";
import ReusableImageUploader from "@/components/ReuseableImageUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import type { IParams } from "@/types/params.type";
import { useGetProductListing } from "@/lib/tanstackquery/productlisting/useGetProductLisitingDetails";
import { useUpdateProductListing } from "@/lib/tanstackquery/productlisting/useUpdateProductListing";
import { showToast } from "@/components/ReactToast";

const inputClass =
  "w-full  border border-slate-200 rounded-lg px-3 py-[11px] text-sm text-slate-800 outline-none focus:border-[#3B6D11] placeholder:text-slate-400 bg-green-50 placeholder:text-[12px]";
const errorInputClass =
  "w-full bg-white border border-rose-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-rose-500/20 placeholder:text-slate-400";
const selectItemClass =
  "relative cursor-pointer rounded-sm py-2 pl-8 pr-3 text-sm text-gray-700 transition-colors " +
  "data-[highlighted]:bg-green-700 data-[highlighted]:text-white " +
  "data-[state=checked]:bg-green-50 data-[state=checked]:text-green-800 data-[state=checked]:font-medium";

function SectionCard({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-slate-200 rounded-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-7 h-7 rounded-full bg-[#3ee93b] text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
          {step}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
          {description && (
            <p className="text-[10px] text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

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

const emptyVariant = (v?: ICreateVariantPayload) => ({
  size: v ? v.size : 0,
  measurementId: v ? v.measurementId : 0,
  quantity: v ? v.quantity : 0,
  pricePerUnit: v ? v.pricePerUnit : 0,
  sellingPrice: v ? v.sellingPrice : null,
});

export default function AddProductPage() {
  const { user } = useAuthContext();
  const [activeField, setActiveField] = useState<string | null>(null);
  const [images, setImages] = useState<IUploadedImage[]>([]);

  const { id } = useParams<IParams>();
  const isEditProductListing = !!id;

  const navigate = useNavigate();

  const { data: productListingDetails, isLoading } = useGetProductListing(id);

  console.log(productListingDetails);

  const { data: productNames = [], isLoading: productNamesLoading } =
    useProductNames();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { data: packagingTypes = [], isLoading: packagingLoading } =
    usePackagingTypes();
  const { data: measurementTypes = [], isLoading: measurementLoading } =
    useMeasurementTypes();

  const createProductListing = useCreateProductListing();
  const updateProductListing = useUpdateProductListing();

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductListingFormValues>({
    resolver: zodResolver(productListingSchema),
    defaultValues: {
      type: isEditProductListing ? productListingDetails?.type : "display",
      keywords: isEditProductListing ? productListingDetails?.keywords : "",
      description: isEditProductListing
        ? productListingDetails?.description
        : "",
      isTaxable: isEditProductListing
        ? productListingDetails?.isTaxable
        : false,
      variants: productListingDetails?.variants?.map((v) =>
        emptyVariant(v),
      ) ?? [emptyVariant()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const listingType = watch("type");

  const categoryOptions = categories.map((c) => ({
    id: c.categoryId,
    label: c.categoryName,
  }));
  const productOptions = productNames.map((p) => ({
    id: p.productId,
    label: p.productName,
  }));
  const packagingOptions = packagingTypes.map((p) => ({
    id: p.packagingId,
    label: p.packagingName,
  }));

  const measurementOptions = measurementTypes.map((m) => ({
    id: m.measurementId,
    label: m.measurementName,
  }));

  const handleCancel = () => {
    if (images.length > 0) {
      handleMultiplFileDelete(images.map((i) => i.fileId));
      setImages([]);
    }
    reset();
    navigate("/product-layout");
  };

  const onSubmit = async (values: ProductListingFormValues) => {
    if (!user?.vendorId) {
      showToast.error("Vendor session not found. Please log in again");
      return;
    }

    if (images.length === 0) {
      showToast.error("At least one image is required !");
      return;
    }

    try {
      const requiredRequestObject = {
        productId: values.productId,
        type: values.type,
        localName: values.localName,
        categoryId: values.categoryId,
        keywords: values.keywords,
        description: values.description,
        images,
        originCountry: values.originCountry,
        farmName: values.farmName,
        packagingTypeId: values.packagingTypeId,
        isTaxable: values.isTaxable,
        variants: values.variants.map((v) => ({
          size: v.size as number,
          measurementId: v.measurementId as number,
          quantity: v.quantity as number,
          pricePerUnit: v.pricePerUnit as number,
          sellingPrice: v.sellingPrice as number | undefined,
        })),
      };

      if (isEditProductListing && productListingDetails) {
        await updateProductListing.mutateAsync({
          ...requiredRequestObject,
          productListingId: productListingDetails.id,
        });

        showToast.success("Success", "Product Details Updated Successfully ");
        setImages([]);
        navigate("/product-layout");
        return;
      }

      await createProductListing.mutateAsync(requiredRequestObject);

      showToast.success("success", "Product submitted for review.");
      setImages([]);
      navigate("/product-layout");
    } catch {
      showToast.error("Failed to submit product on update products.");
    }
  };

  useEffect(() => {
    if (productListingDetails && productListingDetails.images.length > 0) {
      setImages(productListingDetails?.images as IUploadedImage[]);
    }
  }, [productListingDetails]);

  useEffect(() => {
    return () => {
      if (!isEditProductListing && images.length > 0) {
        handleMultiplFileDelete(images.map((i) => i.fileId));
        setImages([]);
      }
    };
  }, []);

  useEffect(() => {
    if (productListingDetails) {
      reset({
        productId: productListingDetails.productId,
        type: productListingDetails.type,
        localName: productListingDetails.localName,
        categoryId: productListingDetails.categoryId,
        keywords: productListingDetails.keywords,
        description: productListingDetails.description,
        // images: productListingDetails.images,
        originCountry: productListingDetails.originCountry,
        farmName: productListingDetails.farmName,
        packagingTypeId: productListingDetails.packagingTypeId,
        isTaxable: productListingDetails.isTaxable,
        variants: productListingDetails.variants,
      });
    }
  }, [productListingDetails, reset]);

  if (isEditProductListing && isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <p className="text-gray-500 text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeading
        title="Add New Product"
        subtitle="List a product for your vendor catalog. Submissions go to admin for review before going live."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
        <SectionCard
          step={1}
          title="Basic information"
          description="What the product is and how it's categorized."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              name="productId"
              label="Product"
              required
              error={errors.productId?.message}
              // activeField={activeField}
              // setActiveField={setActiveField}
            >
              <Controller
                name="productId"
                control={control}
                render={({ field }) => (
                  <ReusableCombobox
                    items={productOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select product"
                    searchPlaceholder="Search products..."
                    loading={productNamesLoading}
                    hasError={!!errors.productId}
                    className=" text-bas border-slate-200 rounded-md w-full"
                    contentClassName="bg-gray-50 border-gray-300 lg:w-[400px]"
                    initialValue={productListingDetails?.productId}
                  />
                )}
              />
            </Field>

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Field
                  name="type"
                  label="Listing type"
                  required
                  activeField={activeField}
                  setActiveField={setActiveField}
                >
                  <Select value={field.value} onValueChange={field.onChange} >
                    <SelectTrigger
                      className="h-11 w-full  rounded-md border-slate-200 bg-green-50 px-3.5 py-5 text-sm text-gray-800
      transition-colors hover:border-gray-400 data-[placeholder]:text-gray-400"
                    >
                      <SelectValue placeholder="Select listing type" />
                    </SelectTrigger>

                    <SelectContent
                      side="bottom"
                      sideOffset={20}
                      // position="popper"
                      className="w-[--radix-select-trigger-width] rounded-sm border border-gray-200 bg-white p-1 shadow-lg"
                    >
                      <SelectItem value="inventory" className={selectItemClass}>
                        <span className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 opacity-0 data-[state=checked]:opacity-100" />
                          Inventory
                        </span>
                      </SelectItem>
                      <SelectItem value="display" className={selectItemClass}>
                        <span className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 opacity-0 data-[state=checked]:opacity-100" />
                          Display
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Field
              name="localName"
              label="Local name"
              activeField={activeField}
              setActiveField={setActiveField}
            >
              <input
                className={inputClass}
                placeholder="e.g. Golbheda"

                {...register("localName")}
              />
            </Field>

            <Field
              name="categoryId"
              label="Category"
              required
              error={errors.categoryId?.message}
              // activeField={activeField}
              // setActiveField={setActiveField}
            >
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <ReusableCombobox
                    items={categoryOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select category"
                    searchPlaceholder="Search categories..."
                    loading={categoriesLoading}
                    hasError={!!errors.categoryId}
                    className=" text-base border-slate-200 rounded-md lg:w-100"
                    contentClassName="bg-gray-50 border-gray-300 lg:w-[400px]"
                    initialValue={productListingDetails?.categoryId}
                  />
                )}
              />
            </Field>

            <Field
              name="keywords"
              label="Keywords"
              activeField={activeField}
              setActiveField={setActiveField}
            >
              <input
                className={inputClass}
                placeholder="organic, fresh, local"
                {...register("keywords")}
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field
              name="description"
              label="Description"
              activeField={activeField}
              setActiveField={setActiveField}
            >
              <textarea
                rows={4}
                className={inputClass}
                placeholder="Describe the product, quality, and anything customers should know"
                {...register("description")}
              />
            </Field>
          </div>
        </SectionCard>

        {/* 2. Origin & packaging */}
        <SectionCard
          step={2}
          title="Origin & packaging"
          description="Where it comes from and how it ships."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              name="originCountry"
              label="Origin country"
              required
              error={errors.originCountry?.message}
              activeField={activeField}
              setActiveField={setActiveField}
            >
              <input
                className={errors.originCountry ? errorInputClass : inputClass}
                placeholder="e.g. Nepal"
                {...register("originCountry")}
              />
            </Field>

            <Field
              name="farmName"
              label="Farm name"
              activeField={activeField}
              setActiveField={setActiveField}
            >
              <input
                className={inputClass}
                placeholder="e.g. Green Valley Farm"
                {...register("farmName")}
              />
            </Field>

            <Field
              name="packagingTypeId"
              label="Packaging type"
              required
              error={errors.packagingTypeId?.message}
              // activeField={activeField}
              // setActiveField={setActiveField}
            >
              <Controller
                name="packagingTypeId"
                control={control}
                render={({ field }) => (
                  <ReusableCombobox
                    items={packagingOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select packaging"
                    searchPlaceholder="Search packaging..."
                    loading={packagingLoading}
                    hasError={!!errors.packagingTypeId}
                    className=" text-base  border-slate-200 rounded-md lg:w-100"
                    contentClassName=" border-gray-300 lg:w-[400px]"
                    initialValue={productListingDetails?.packagingTypeId}
                  />
                )}
              />
            </Field>

            <div className="flex items-center gap-2 pt-7">
              <input
                id="isTaxable"
                type="checkbox"
                className="
    w-4 h-5
    rounded
    border-slate-300
    accent-[#00db4d]
    text-white
  "
                {...register("isTaxable")}
              />
              <label htmlFor="isTaxable" className="text-sm text-slate-700">
                This product is taxable
              </label>
            </div>
          </div>
        </SectionCard>

        {/* 3. Variants */}
        <SectionCard
          step={3}
          title="Variants"
          description="Size and pricing options buyers can choose from."
        >
          <div className="flex flex-col gap-4">
            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="border border-slate-200 rounded-xl p-4 relative"
              >
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="absolute top-3 right-3 text-slate-300 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <p className="text-xs font-medium text-slate-500 mb-3">
                  Variant {idx + 1}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field
                    name={`variants.${idx}.size`}
                    label="Size"
                    required
                    error={errors.variants?.[idx]?.size?.message}
                    activeField={activeField}
                    setActiveField={setActiveField}
                  >
                    <input
                      type="number"
                      step="any"
                      className={
                        errors.variants?.[idx]?.size
                          ? errorInputClass
                          : inputClass
                      }
                      placeholder="500"
                      {...register(`variants.${idx}.size`)}
                      min={0}
                    />
                  </Field>

                  <Field
                    name={`variants.${idx}.measurementId`}
                    label="Unit"
                    required
                    error={errors.variants?.[idx]?.measurementId?.message}
                    // activeField={activeField}
                    // setActiveField={setActiveField}
                  >
                    <Controller
                      name={`variants.${idx}.measurementId`}
                      control={control}
                      render={({ field: f }) => (
                        <ReusableCombobox
                          items={measurementOptions}
                          value={f.value as number}
                          onChange={f.onChange}
                          placeholder="Unit"
                          searchPlaceholder="Search units..."
                          loading={measurementLoading}
                          hasError={!!errors.variants?.[idx]?.measurementId}
                          className=" text-base border-slate-200 rounded-md lg:w-100"
                          contentClassName="bg-gray-50 border-gray-300 lg:w-[400px]"
                        />
                      )}
                    />
                  </Field>

                  <Field
                    name={`variants.${idx}.quantity`}
                    label="Quantity"
                    required
                    error={errors.variants?.[idx]?.quantity?.message}
                    activeField={activeField}
                    setActiveField={setActiveField}
                  >
                    <input
                      type="number"
                      className={
                        errors.variants?.[idx]?.quantity
                          ? errorInputClass
                          : inputClass
                      }
                      placeholder="100"
                      {...register(`variants.${idx}.quantity`)}
                      min={0}
                    />
                  </Field>

                  <Field
                    name={`variants.${idx}.pricePerUnit`}
                    label="Price / unit"
                    required
                    error={errors.variants?.[idx]?.pricePerUnit?.message}
                    activeField={activeField}
                    setActiveField={setActiveField}
                  >
                    <input
                      type="number"
                      step="any"
                      className={
                        errors.variants?.[idx]?.pricePerUnit
                          ? errorInputClass
                          : inputClass
                      }
                      placeholder="120"
                      {...register(`variants.${idx}.pricePerUnit`)}
                      min={0}
                    />
                  </Field>

                  {listingType === "inventory" && (
                    <Field
                      name={`variants.${idx}.sellingPrice`}
                      label="Selling price"
                      required
                      error={errors.variants?.[idx]?.sellingPrice?.message}
                      activeField={activeField}
                      setActiveField={setActiveField}
                    >
                      <input
                        type="number"
                        step="any"
                        className={
                          errors.variants?.[idx]?.sellingPrice
                            ? errorInputClass
                            : inputClass
                        }
                        placeholder="150"
                        min={0}
                        {...register(`variants.${idx}.sellingPrice`)}
                      />
                    </Field>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append(emptyVariant())}
              className="flex items-center gap-1.5 text-sm font-medium text-[#3B6D11] hover:text-[#3B6D11]/80 w-fit"
            >
              <Plus className="w-4 h-4" />
              Add another variant
            </button>
          </div>
        </SectionCard>

        {/* 4. Images — moved after variants */}
        <SectionCard
          step={4}
          title="Product images"
          description="Add at least one clear photo. First image is used as the cover."
        >
          <ReusableImageUploader
            images={images}
            onImagesChange={setImages}
            multiple
          />
        </SectionCard>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pb-8">
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              createProductListing.isPending ||
              updateProductListing.isPending
            }
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium bg-[#3B6D11] text-white hover:bg-[#3B6D11]/90 disabled:opacity-60 transition-colors"
          >
            {isEditProductListing
              ? "Update Product for review"
              : "Submit for review"}
          </button>
        </div>
      </form>
    </div>
  );
}
