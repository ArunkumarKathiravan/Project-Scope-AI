import { z } from "zod";
import { categories, projectLevels, searchSourceOptions } from "@/types";

const cleanList = z
  .array(z.string().trim().min(1).max(80))
  .max(30)
  .transform((items) => [...new Set(items.map((item) => item.trim()))]);
export const projectInputSchema = z.object({
  title: z.string().trim().min(3, "Enter a project title of at least 3 characters.").max(150),
  description: z
    .string()
    .trim()
    .min(20, "Describe the project in at least 20 characters.")
    .max(5000),
  category: z.enum(categories),
  level: z.enum(projectLevels),
  technologies: cleanList,
  components: cleanList,
  sources: z.enum(searchSourceOptions)
});
export type ProjectInputValues = z.infer<typeof projectInputSchema>;
