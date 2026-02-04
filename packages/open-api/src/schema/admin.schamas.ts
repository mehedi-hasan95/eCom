import z from "zod";
import { slugRegex } from "./regx";

export const categorySchema = z
  .object({
    name: z.string().min(1).max(50),
    slug: z.string().min(1).max(80).regex(slugRegex, "Invalid slug format"),
    image: z
      .instanceof(File)
      .refine((file) => file.type.startsWith("image/"), {
        message: "Only image files are allowed",
      })
      .refine((file) => file.size <= 2 * 1024 * 1024, {
        message: "Image size must be less than 2MB",
      })
      .optional(),
    previousImage: z.string().optional(),
  })
  .refine((data) => !(data.image && data.previousImage), {
    message: "Remove the previous image before uploading a new one",
    path: ["image"],
  });
