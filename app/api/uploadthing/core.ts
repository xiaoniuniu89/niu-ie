import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  sampleAssetUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 3 },
    pdf: { maxFileSize: "16MB", maxFileCount: 3 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url, name: file.name };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
