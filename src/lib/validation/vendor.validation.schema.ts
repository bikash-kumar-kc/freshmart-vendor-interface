import * as z from "zod";

export const vendorRegistrationSchema = z.object({
  farmName: z.string().trim().min(1, "Farm name is required"),
  farmOriginCountry: z.string().trim().min(1, "Origin country is required"),
  farmDescription: z.string().trim().optional(),
  farmOwner: z.string().trim().min(1, "Owner name is required"),
  phoneNumber: z.string().trim().min(1, "Phone number is required"),
  addressLocation: z.string().trim().min(1, "Address is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  vatNumber: z.string().trim().min(1, "VAT number is required"),
});


export type VendorRegistrationFormValues = z.infer<
  typeof vendorRegistrationSchema
>;
