import z from "zod";

const MAX_TOTAL_SIZE = 16 * 1024 * 1024;
export const productCreateSchema = z.object({
  title: z.string().min(1),
  images: z
    .array(
      z.instanceof(File).refine((file) => file.type.startsWith("image/"), {
        message: "Only image files are allowed",
      }),
    )
    .min(1, "At least one image is required")
    .max(5, "You can't add more then 5 images")
    .refine(
      (files) =>
        files.reduce((total, file) => total + file.size, 0) <= MAX_TOTAL_SIZE,
      {
        message: "Total image size must be less than 16MB",
      },
    ),
});
