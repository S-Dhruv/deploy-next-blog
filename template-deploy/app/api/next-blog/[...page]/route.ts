import nextBlog, {FileDBAdapter, MongoAdapter, S3Adapter, FileSystemStorage} from "@supergrowthai/next-blog"
import path from 'path';

// --- CONFIGURATION ---
const isProduction = process.env.NODE_ENV === "production";

// 1. Database: MongoDB (Prod) OR FileDB (Dev)
const dbProvider = async () => {
    if (isProduction && process.env.MONGODB_URI) {
        return new MongoAdapter(process.env.MONGODB_URI, process.env.MONGODB_DB_NAME || 'nextblog');
    }
    // Fallback to FileDB
    return new FileDBAdapter(path.join(process.cwd(), "blog-data"));
};

// 2. Storage: S3 (Prod) OR Local Filesystem (Dev)
const storageProvider = async () => {
    if (process.env.S3_BUCKET && process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY) {
        return new S3Adapter({
            bucket: process.env.S3_BUCKET,
            region: process.env.S3_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_KEY
            }
        });
    }
    // Fallback to local storage
    return new FileSystemStorage(path.join(process.cwd(), "public/uploads"));
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
