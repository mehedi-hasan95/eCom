import z from "zod";

const MAX_TOTAL_SIZE = 16 * 1024 * 1024;
const customError = "custom" as const;
export const productCreateSchema = z
  .object({
    title: z.string().min(1),
    shortDescription: z.string().max(160),
    basePrice: z.coerce.number().nonnegative(),
    salePrice: z.coerce.number().nonnegative(),
    stock: z.coerce.number().int().nonnegative(),
    tags: z.array(z.string()).optional(),
    weight: z.coerce.number().nonnegative().optional(),
    type: z.enum(["physical", "digital", "service"]).default("physical"),
    status: z.enum(["draft", "active", "archived"]).default("draft"),
    images: z
      .array(
        z.instanceof(File).refine((file) => file.type.startsWith("image/"), {
          message: "Only image files are allowed",
        }),
      )
      // .min(1, "At least one image is required")
      .max(5, "You can't add more then 5 images")
      .optional()
      .refine(
        (files) =>
          files &&
          files.reduce((total, file) => total + file.size, 0) <= MAX_TOTAL_SIZE,
        {
          message: "Total image size must be less than 16MB",
        },
      ),
    previousImage: z.array(z.string()).optional(),
    categorySlug: z.string().nonempty(),
    subCategorySlug: z.string().nonempty(),
    color: z
      .array(
        z
          .string()
          .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color"),
      )
      .optional(),
    specification: z
      .array(
        z
          .object({
            key: z.string(),
            value: z.string(),
          })
          .refine(
            (data) =>
              (data.key === "" && data.value === "") ||
              (data.key !== "" && data.value !== ""),
            {
              message: "Both key and value are required",
              path: ["value"],
            },
          ),
      )
      .optional(),
    description: z.string(),
    cashOnDelevary: z.boolean().default(false),
    cupon: z.string().max(20).optional(),
    sizes: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    const newImagesCount = data.images?.length ?? 0;
    const previousImagesCount = data?.previousImage?.length ?? 0;
    const totalCount = newImagesCount + previousImagesCount;

    // ✅ Require at least one image
    if (totalCount === 0) {
      ctx.addIssue({
        path: ["images"],
        code: customError,
        message: "Please add at least one image",
      });
      return; // stop further validation
    }

    // ✅ Max 5 images rule
    if (totalCount > 5) {
      if (previousImagesCount > 0) {
        ctx.addIssue({
          path: ["images"],
          code: customError,
          message: "Remove previous images first to add more images",
        });
      } else {
        ctx.addIssue({
          path: ["images"],
          code: customError,
          message: "You can upload at most 5 images",
        });
      }
    }
  });

export const updateProductSchema = productCreateSchema.extend({
  id: z.string(),
  sellerEmail: z.string(),
});

/**
 * ============================================================
 * 📌 Schema: Product for server
 * ============================================================
 */
export const productSchemasForserver = z
  .object({
    title: z.string().min(1),

    // 👇 Accept single OR multiple files, normalize to array
    images: z
      .preprocess(
        (val) => (Array.isArray(val) ? val : [val]),
        z.array(z.any().optional()),
      )
      .optional(),
    previousImage: z.preprocess(
      (val) => (Array.isArray(val) ? val : [val]),
      z.array(z.string()).optional(),
    ),
    shortDescription: z.string().max(160),
    basePrice: z.coerce.number().nonnegative(),
    salePrice: z.coerce.number().nonnegative(),
    stock: z.coerce.number().int().nonnegative(),
    tags: z.preprocess(
      (val) => (Array.isArray(val) ? val : [val]),
      z.array(z.string()).optional(),
    ),
    color: z.preprocess(
      (val) => (Array.isArray(val) ? val : [val]),
      z
        .array(
          z
            .string()
            .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color"),
        )
        .optional(),
    ),
    sizes: z.preprocess(
      (val) => (Array.isArray(val) ? val : [val]),
      z.array(z.string()).optional(),
    ),
    specification: z.preprocess(
      (val) => {
        if (!val) return undefined;

        const arr = Array.isArray(val) ? val : [val];

        return arr.flatMap((v) => (typeof v === "string" ? JSON.parse(v) : v));
      },
      z
        .array(
          z
            .object({
              key: z.string(),
              value: z.string(),
            })
            .refine(
              (data) =>
                (data.key === "" && data.value === "") ||
                (data.key !== "" && data.value !== ""),
              {
                message: "Both key and value are required",
                path: ["value"],
              },
            ),
        )
        .optional(),
    ),
    description: z.string(),
    cashOnDelevary: z
      .union([z.boolean(), z.string()])
      .transform((val) => val === true || val === "true")
      .default(false),
    cupon: z.string().max(20).optional(),
    categorySlug: z.string().nonempty(),
    subCategorySlug: z.string().nonempty(),
    weight: z.coerce.number().nonnegative().optional(),
    type: z.enum(["physical", "digital", "service"]).default("physical"),
    status: z.enum(["draft", "active", "archived"]).default("draft"),
  })
  .superRefine((data, ctx) => {
    const totalCount =
      (data?.images?.length ?? 0) + (data?.previousImage?.length ?? 0);
    if (totalCount === 0) {
      ctx.addIssue({
        path: ["images"],
        code: customError,
        message: "Please add at least one image",
      });
      return; // stop further validation
    }
    if (totalCount > 5) {
      // If previous images exist, force user to remove them first
      if ((data?.previousImage?.length ?? 0) > 0) {
        ctx.addIssue({
          path: ["images"],
          code: customError,
          message: "Remove previous images first to add more images",
        });
      } else {
        ctx.addIssue({
          path: ["images"],
          code: customError,
          message: `You can upload at most ${5} images`,
        });
      }
    }
  });

export const updateProductSchemasForserver = productSchemasForserver.extend({
  id: z.string(),
  sellerEmail: z.string(),
});

export const deleteProductSchema = z.object({
  id: z.string(),
  sellerEmail: z.string(),
});

export const addToCartSchema = z.object({
  quantity: z
    .number()
    .positive()
    .min(1)
    .max(10, { message: "You can't add more than 10 products" })
    .default(1),
  size: z.string().optional(),
  color: z.string().optional(),
  productId: z.string(),
  usedCupon: z.boolean().default(false).optional(),
});

export const shippingFormSchema = z.object({
  line1: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  phone: z.string().regex(/^\+?\d+$/, {
    message: "Phone number must contain only digits and an optional leading +",
  }),
  country: z.string(),
});
