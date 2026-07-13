import { test, expect } from "@playwright/test";
test("home page and validation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Discover, compare/i })).toBeVisible();
  await page.getByRole("button", { name: /Analyse and search/i }).click();
  await expect(page.getByText(/at least 3 characters/i)).toBeVisible();
});
test("mock search, result tabs, save and compare", async ({ page }) => {
  await page.route("**/api/analyse", async (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        id: "x",
        searchedAt: new Date().toISOString(),
        analysis: {
          originalTitle: "ESP32",
          improvedTitle: "ESP32 Project",
          summary: "Accessible automation summary",
          category: "Internet of Things",
          level: "Beginner",
          keywords: ["esp32"],
          technologies: ["ESP32"],
          components: ["Relay"],
          intendedUsers: ["older adults"],
          problem: "control",
          expectedOutput: "working system",
          generatedQueries: ["esp32 project"]
        },
        results: [
          {
            id: "r",
            source: "github",
            title: "demo/repo",
            description: "ESP32 relay project",
            url: "https://github.com/topics/esp32",
            similarity: {
              total: 70,
              semantic: 70,
              title: 60,
              keyword: 80,
              technology: 100,
              component: 60,
              category: 50,
              sourceContent: 0,
              classification: "Related Project",
              confidence: "Medium",
              matchingFeatures: ["esp32"],
              missingFeatures: ["Relay"],
              differentFeatures: [],
              explanation: "estimate"
            }
          }
        ],
        outcomes: [],
        improvements: {
          basic: ["Build core"],
          intermediate: [],
          advanced: [],
          alternativeTitles: [],
          suggestedTechnologies: [],
          suggestedComponents: [],
          safety: [],
          privacy: [],
          futureScope: [],
          academicTopics: []
        },
        demoMode: true,
        disclaimer: "Demo"
      })
    })
  );
  await page.goto("/");
  await page.getByRole("button", { name: /Accessible ESP32/i }).click();
  await page.getByRole("button", { name: /Analyse and search/i }).click();
  await expect(page).toHaveURL(/results/);
  await expect(page.getByText("demo/repo")).toBeVisible();
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "Compare" }).click();
  await expect(page).toHaveURL(/compare/);
});
