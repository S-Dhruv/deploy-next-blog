import {FileDBAdapter, MongoAdapter} from "@supergrowthai/next-blog";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

export const dbProvider = async () => {
    if (isProduction && process.env.MONGODB_URI) {
        return new MongoAdapter(process.env.MONGODB_URI, process.env.MONGODB_DB_NAME || 'nextblog');
    }
    // Fallback to FileDB
    return new FileDBAdapter(path.join(process.cwd(), "blog-data"));
};
