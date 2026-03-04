import { expect, test } from "./fixtures";

test.describe("API /api/leads", () => {
  test("returns 200 with valid lead data", async ({ request }) => {
    const response = await request.post("/api/leads", {
      data: {
        name: "E2E Test",
        phone: "+420 777 888 999",
        property_type: "byt",
        region: "Praha",
        situation_type: "standard",
        consent_gdpr: true,
        email: "",
        website: "",
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("ok", true);
  });

  test("returns 400 with invalid data", async ({ request }) => {
    const response = await request.post("/api/leads", {
      data: { name: "" },
    });
    expect(response.status()).toBe(400);
  });
});
