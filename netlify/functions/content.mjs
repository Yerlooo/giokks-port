
import { getStore } from "@netlify/blobs";

const store = getStore("portfolio-content");

export default async (request) => {
  if (request.method === "GET") {
    try {
      const content = await store.get("content", {
        type: "json",
      });

      return Response.json(content ?? {});
    } catch (error) {
      console.error("Failed to read content:", error);
      return Response.json(
        { error: "Failed to read content" },
        { status: 500 },
      );
    }
  }

  if (request.method === "POST") {
    const expectedToken = process.env.CMS_TOKEN;
    const providedToken = request.headers.get("x-cms-token");

    if (
      !expectedToken ||
      !providedToken ||
      providedToken !== expectedToken
    ) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    try {
      const content = await request.json();

      if (
        !content ||
        typeof content !== "object" ||
        Array.isArray(content)
      ) {
        return Response.json(
          { error: "Invalid content" },
          { status: 400 },
        );
      }

      await store.setJSON("content", content);

      return Response.json({ saved: true });
    } catch (error) {
      console.error("Failed to save content:", error);
      return Response.json(
        { error: "Failed to save content" },
        { status: 400 },
      );
    }
  }

  return Response.json(
    { error: "Method not allowed" },
    {
      status: 405,
      headers: { Allow: "GET, POST" },
    },
  );
};