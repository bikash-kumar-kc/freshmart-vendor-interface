
import { z } from 'zod';

const variantSchema = z.object({
  size: z.number({ error: 'Required' }).positive('Required'),
  measurementId: z.number({ error: 'Required' }).positive('Required'),
  quantity: z.number({error: 'Required' }).min(0, 'Required'),
  pricePerUnit: z.number({error: 'Required' }).positive('Required'),
  sellingPrice: z.number().positive().optional().nullable(),
});

export const productListingSchema = z
  .object({
    productId: z.number({error: 'Select a product' }).positive('Select a product'),
    type: z.enum(['inventory', 'display']),
    localName: z.string().optional(),
    categoryId: z.number({error: 'Select a category' }).positive('Select a category'),
    keywords: z.string().optional(),
    description: z.string().optional(),
    originCountry: z.string().min(1, 'Origin country is required'),
    farmName: z.string().optional(),
    packagingTypeId: z
      .number({error: 'Select a packaging type' })
      .positive('Select a packaging type'),
    isTaxable: z.boolean(),
    variants: z.array(variantSchema).min(1, 'Add at least one variant'),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'inventory') {
      data.variants.forEach((v, i) => {
        if (v.sellingPrice === undefined || v.sellingPrice === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Selling price is required for Inventory products',
            path: ['variants', i, 'sellingPrice'],
          });
        }
      });
    }
  });

// export type ProductListingFormValues = z.infer<typeof productListingSchema>;
export type ProductListingFormValues =
  z.input<typeof productListingSchema>;