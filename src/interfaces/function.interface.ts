import { IUserDocument } from "@src/db/model/user.model";
import { Request } from "express";
import mongoose, { FilterQuery, Types } from "mongoose";

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
export type Id = Types.ObjectId | string;

interface File {
  path: string;
  filename: string;
}
export interface ISort {
  field?: string;
  order?: "asc" | "desc";
}
export interface PageOptions {
  limit?: number;
  page?: number;
  sort?: ISort;
}

export interface IRequest extends Request {
  filters?: FilterQuery<any>;
  pageOpt?: PageOptions;
  fileValidationError?: Error;
  file?: File;
  paramIds?: Record<string, mongoose.Types.ObjectId>;
  user?: IUserDocument;
}
export interface DecodedToken {
  expired: boolean | string | Error;
}

export interface DecodedAuthToken extends DecodedToken {
  payload: IUserDocument | null;
}
