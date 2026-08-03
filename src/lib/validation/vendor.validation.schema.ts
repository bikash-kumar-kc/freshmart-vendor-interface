import * as z from "zod";

export const vendorApplySchema = z.object({
  email: z.email().nonempty(),
  farmName: z.string().nonempty(),
  farmOriginCountry: z.string().nonempty(),
  farmDescription: z.string().nullable(),
  farmOwner: z.string().nonempty(),
  addressLocation: z.string().nonempty(),
  vatNumber: z.string().nonempty(),
  panVatCertificateUr: z.array(z.url()),
  certificates: z.array(z.url()),
});
