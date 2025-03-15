// src/@types/express/index.d.ts
import mongoose, { Types, FilterQuery } from "mongoose";

export type Id = Types.ObjectId | string;

interface File {
  path: string;
  filename: string;
}

declare global {
  namespace Express {
    interface Request {
      filters?: FilterQuery<any>;
      // pageOpts?: PageOptions;
      fileValidationError?: Error;
      file?: File;
      paramIds?: Record<string, mongoose.Types.ObjectId>;
    }
  }
}
