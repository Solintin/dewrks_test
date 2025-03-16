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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_model_1 = __importDefault(require("../db/model/task.model"));
const errors_1 = require("../errors");
const mongoose_1 = __importDefault(require("mongoose"));
const base_service_1 = __importDefault(require("./base.service"));
class TaskService extends base_service_1.default {
    constructor() {
        super("Task", task_model_1.default);
        this.TaskModel = task_model_1.default;
    }
    saveOrUpdateTask(data, filterQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let task;
                if (filterQuery) {
                    const existingTask = yield this.TaskModel.findOne(filterQuery);
                    if (!existingTask) {
                        throw new errors_1.BadRequestError("Task not found");
                    }
                    data.statusTracker = existingTask.statusTracker || [];
                    if (data.status && data.status !== existingTask.status) {
                        data.statusTracker.push({
                            status: data.status,
                            updateAt: Date.now(),
                        });
                    }
                    task = yield this.TaskModel.findOneAndUpdate(filterQuery, data, {
                        new: true,
                        runValidators: true,
                        upsert: false,
                    });
                }
                else {
                    task = new this.TaskModel(Object.assign(Object.assign({}, data), { statusTracker: data.status
                            ? [{ status: data.status, updateAt: Date.now() }]
                            : [] }));
                    yield task.save();
                }
                return task;
            }
            catch (error) {
                throw new errors_1.BadRequestError("Error saving/updating task: " + error.message);
            }
        });
    }
    countByStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.TaskModel.aggregate([
                    {
                        $match: { user_id: new mongoose_1.default.Types.ObjectId(userId) },
                    },
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 },
                        },
                    },
                ]);
            }
            catch (error) {
                throw new errors_1.BadRequestError("Error counting task: " + error.message);
            }
        });
    }
}
exports.default = new TaskService();
