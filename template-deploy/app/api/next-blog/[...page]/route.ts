import {nextBlog} from "@supergrowthai/next-blog/next";
import {S3StorageAdapter as S3Adapter, LocalStorageAdapter as FileSystemStorage} from "@supergrowthai/next-blog/storage";
import path from 'path';
import {dbProvider} from "@/lib/db";

// --- CONFIGURATION ---

// 2. Storage: S3 (Prod) OR Local Filesystem (Dev)
const storageProvider = async () => {
    if (process.env.S3_BUCKET && process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY) {
        return new S3Adapter(
          "next-blog-storage", // A pluginId or unique identifier for the storage instance
          {
            bucket: process.env.S3_BUCKET,
            region: process.env.S3_REGION || 'us-east-1',
            accessKey: process.env.S3_ACCESS_KEY,
            secretKey: process.env.S3_SECRET_KEY
          });
    }
    // Fallback to local storage
    return new FileSystemStorage("next-blog-storage-local"); // A pluginId or unique identifier for the storage instance
};

// Initialize Next-Blog
const {GET, POST} = nextBlog({
    db: dbProvider,
    storage: storageProvider,
    config: {
        title: process.env.NEXT_PUBLIC_SITE_TITLE || "My Production Blog",
        description: "Powered by Next-Blog",
        sessionSecret: process.env.SESSION_SECRET, // Critical for security
        adminEmail: process.env.ADMIN_EMAIL
    }
})

export {GET, POST};
