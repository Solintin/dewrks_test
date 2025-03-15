import { NotFoundError } from "@src/errors";
import {
  PageOptions,
  PaginatedResult,
} from "@src/interfaces/function.interface";
import {
  ClientSession,
  FilterQuery,
  Model,
  PopulateOption,
  PopulateOptions,
  SortOrder,
  Document,
} from "mongoose";

export interface SortBy<T> {
  field?: keyof T;
  order?: SortOrder;
}

export interface DocumentWithTimeStamp extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  initiated?: Date;
}

class BaseDocumentService<T extends DocumentWithTimeStamp> {
  private readonly resourceName: string;
  private readonly resourceModel: Model<T>;
  private readonly defaultSorting: SortBy<T>;

  constructor(
    resourceName: string,
    resourceModel: Model<T>,
    defaultSorting: SortBy<T> = { field: "createdAt", order: "desc" }
  ) {
    this.resourceName = resourceName;
    this.resourceModel = resourceModel;
    this.defaultSorting = defaultSorting;
  }
  public count = async (
    filterQuery: FilterQuery<T>,
    session?: ClientSession
  ): Promise<number> => {
    const count = await this.resourceModel.countDocuments(filterQuery, session);
    return count;
  };

  public getAll = async (
    filterQuery: FilterQuery<T> = {},
    populateData?: PopulateOptions[],
    pageOpt: PageOptions = {
      sort: this.defaultSorting as any,
      page: 1,
      limit: 10,
    }
  ): Promise<PaginatedResult<T>> => {
    const field = pageOpt.sort?.field || this.defaultSorting.field;
    const order = pageOpt.sort?.order || this.defaultSorting.order;
    const limit = pageOpt.limit || 10;
    const page = pageOpt.page || 1;

    // Ensure page and limit are valid numbers
    const pageNumber = Math.max(1, page); // Ensure page is at l east 1
    const pageSize = Math.max(1, limit); // Ensure limit is at least 1
    const skip = (pageNumber - 1) * pageSize;

    // Get total document count
    const totalRecords = await this.resourceModel.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Fetch records with pagination
    const records = await this.resourceModel
      .find(filterQuery)
      .populate(populateData)
      .sort({ [field]: order })
      .skip(skip)
      .limit(pageSize);

    // Return data and pagination metadata
    return {
      data: records,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: pageNumber,
        pageSize,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    };
  };

  public getOrError = async (
    filterQuery?: FilterQuery<T>,
    populateData?: PopulateOptions[],
    session?: ClientSession
  ): Promise<T> => {
    const record = await this.resourceModel
      .findOne(filterQuery, null, { session })
      .populate(populateData);

    if (!record) {
      throw new NotFoundError(`${this.resourceName} not found`);
    }
    return record as T;
  };

  public deleteOne = async (
    filterQuery: FilterQuery<T>,
    session?: ClientSession
  ): Promise<T> => {
    const record: T | null = await this.resourceModel.findOneAndDelete(
      filterQuery,
      { session }
    );

    if (!record) {
      throw new NotFoundError(`${this.resourceName} not found`);
    }

    return record;
  };

  public generatePopulateData = (
    field: string,
    attributes?: unknown,
    populateData?: PopulateOptions[],
    virtualPopulateOption?: { localField?: string; foreignField?: string }
  ): PopulateOptions => {
    return {
      path: field,
      ...(attributes && { select: attributes }),
      ...(populateData && { populate: populateData }),
      ...(virtualPopulateOption?.localField && {
        localField: virtualPopulateOption?.localField,
      }),
      ...(virtualPopulateOption?.foreignField && {
        foreignField: virtualPopulateOption?.foreignField,
      }),
    };
  };
}

export default BaseDocumentService;
