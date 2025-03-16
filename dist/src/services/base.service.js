"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
class BaseDocumentService {
    constructor(resourceName, resourceModel, defaultSorting = { field: "createdAt", order: "desc" }) {
        this.count = (filterQuery, session) => __awaiter(this, void 0, void 0, function* () {
            const count = yield this.resourceModel.countDocuments(filterQuery, session);
            return count;
        });
        this.getAll = (...args_1) => __awaiter(this, [...args_1], void 0, function* (filterQuery = {}, populateData, pageOpt = {
            sort: this.defaultSorting,
            page: 1,
            limit: 10,
        }) {
            var _a, _b;
            const field = ((_a = pageOpt.sort) === null || _a === void 0 ? void 0 : _a.field) || this.defaultSorting.field;
            const order = ((_b = pageOpt.sort) === null || _b === void 0 ? void 0 : _b.order) || this.defaultSorting.order;
            const limit = pageOpt.limit || 10;
            const page = pageOpt.page || 1;
            const pageNumber = Math.max(1, page);
            const pageSize = Math.max(1, limit);
            const skip = (pageNumber - 1) * pageSize;
            const totalRecords = yield this.resourceModel.countDocuments(filterQuery);
            const totalPages = Math.ceil(totalRecords / pageSize);
            const records = yield this.resourceModel
                .find(filterQuery)
                .populate(populateData)
                .sort({ [field]: order })
                .skip(skip)
                .limit(pageSize);
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
        });
        this.getOrError = (filterQuery, populateData, session) => __awaiter(this, void 0, void 0, function* () {
            const record = yield this.resourceModel
                .findOne(filterQuery, null, { session })
                .populate(populateData);
            if (!record) {
                throw new errors_1.NotFoundError(`${this.resourceName} not found`);
            }
            return record;
        });
        this.deleteOne = (filterQuery, session) => __awaiter(this, void 0, void 0, function* () {
            const record = yield this.resourceModel.findOneAndDelete(filterQuery, { session });
            if (!record) {
                throw new errors_1.NotFoundError(`${this.resourceName} not found`);
            }
            return record;
        });
        this.generatePopulateData = (field, attributes, populateData, virtualPopulateOption) => {
            return Object.assign(Object.assign(Object.assign(Object.assign({ path: field }, (attributes && { select: attributes })), (populateData && { populate: populateData })), ((virtualPopulateOption === null || virtualPopulateOption === void 0 ? void 0 : virtualPopulateOption.localField) && {
                localField: virtualPopulateOption === null || virtualPopulateOption === void 0 ? void 0 : virtualPopulateOption.localField,
            })), ((virtualPopulateOption === null || virtualPopulateOption === void 0 ? void 0 : virtualPopulateOption.foreignField) && {
                foreignField: virtualPopulateOption === null || virtualPopulateOption === void 0 ? void 0 : virtualPopulateOption.foreignField,
            }));
        };
        this.resourceName = resourceName;
        this.resourceModel = resourceModel;
        this.defaultSorting = defaultSorting;
    }
}
exports.default = BaseDocumentService;
