import { describe, expect, it } from "vitest";
import { projectInputSchema } from "@/lib/validation/project";
const valid = {
  title: "ESP32 Controller",
  description: "A detailed project description with enough information for validation.",
  category: "Internet of Things",
  level: "Beginner",
  technologies: ["ESP32"],
  components: ["Relay"],
  sources: "all"
};
describe("project validation", () => {
  it("accepts valid input", () => expect(projectInputSchema.safeParse(valid).success).toBe(true));
  it("rejects short descriptions", () =>
    expect(projectInputSchema.safeParse({ ...valid, description: "too short" }).success).toBe(
      false
    ));
  it("limits tag count", () =>
    expect(
      projectInputSchema.safeParse({
        ...valid,
        technologies: Array.from({ length: 31 }, (_, i) => `t${i}`)
      }).success
    ).toBe(false));
});
