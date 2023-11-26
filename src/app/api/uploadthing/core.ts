import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";
const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      const { getUser } = getKindeServerSession();
      const user = getUser();
      if (!user || !user.id) {
        throw new Error("UNAUTHORIZED");
      }
      return {userId:user.id};
    })
    .onUploadComplete(async ({ metadata, file }) => {
        console.log('metadata:', metadata);
        console.log('file:', file);

      const createdFile = await db.file.create({
        data: {
            key: file.key,
            name: file.name,
            userId: metadata.userId,
            url: file.url,
            uploadStatus: 'PROCESSING',
        },
      });
      console.log('Created File:', createdFile);


      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
