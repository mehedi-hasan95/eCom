// apps/api/src/routes/upload.ts
import { utapi } from "@workspace/uploadthing";
import { Hono } from "hono";

const uploadRoute = new Hono();

uploadRoute.post("/upload", async (c) => {
  const body = await c.req.parseBody();

  const file = body.file;
  if (!(file instanceof File)) {
    return c.json({ error: "File is required" }, 400);
  }

  const res = await utapi.uploadFiles(file);

  if (!res.data) {
    return c.json({ error: "Upload failed" }, 500);
  }

  return c.json({
    url: res.data.ufsUrl,
    key: res.data.key,
    name: res.data.name,
    size: res.data.size,
  });
});

export default uploadRoute;
