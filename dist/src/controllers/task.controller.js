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
const task_service_1 = __importDefault(require("../services/task.service"));
const logger_1 = __importDefault(require("../utils/logger"));
class taskController {
    create(req, res, Next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body: data, user } = req;
                const payload = Object.assign(Object.assign({}, data), { user_id: user._id });
                const task = yield task_service_1.default.saveOrUpdateTask(payload);
                return res.status(201).json({
                    message: `Task Created Successfully`,
                    data: task,
                });
            }
            catch (error) {
                logger_1.default.log("error", `Error in create task controller method: ${error}`);
                Next(error);
            }
        });
    }
    update(req, res, Next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body: data, paramIds: { taskId }, } = req;
                const task = yield task_service_1.default.saveOrUpdateTask(data, {
                    _id: taskId,
                });
                return res.status(200).json({
                    message: `Task updated Successfully`,
                    data: task,
                });
            }
            catch (error) {
                logger_1.default.log("error", `Error in update task controller method: ${error}`);
                Next(error);
            }
        });
    }
    delete(req, res, Next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body: data, paramIds: { taskId }, } = req;
                const task = yield task_service_1.default.deleteOne({
                    _id: taskId,
                });
                return res.status(200).json({
                    message: `Task deleted Successfully`,
                    data: task,
                });
            }
            catch (error) {
                logger_1.default.log("error", `Error in delete task controller method: ${error}`);
                Next(error);
            }
        });
    }
    get(req, res, Next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body: data, paramIds: { taskId }, } = req;
                const task = yield task_service_1.default.getOrError({
                    _id: taskId,
                });
                return res.status(200).json({
                    message: `Task Fetched Successfully`,
                    data: task,
                });
            }
            catch (error) {
                logger_1.default.log("error", `Error in fetching task controller method: ${error}`);
                Next(error);
            }
        });
    }
    overview(req, res, Next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { _id: userId }, } = req;
            try {
                const task = yield task_service_1.default.countByStatus(userId);
                return res.status(200).json({
                    message: `Tasks Overview Successfully`,
                    data: task,
                });
            }
            catch (error) {
                logger_1.default.log("error", `Error in fetching task controller method: ${error}`);
                Next(error);
            }
        });
    }
    index(req, res, Next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filters, pageOpt, user } = req;
                const tasks = yield task_service_1.default.getAll(Object.assign(Object.assign({}, filters), { user_id: user._id }), null, pageOpt);
                return res.status(200).json({
                    message: `Tasks Retrieved Successfully`,
                    data: tasks,
                });
            }
            catch (error) {
                logger_1.default.log("error", `Error in retrieving task controller method: ${error}`);
                Next(error);
            }
        });
    }
}
exports.default = taskController;
