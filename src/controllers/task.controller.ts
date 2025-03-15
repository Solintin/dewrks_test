import { ITask } from "@src/db/model/task.model";
import { IRequest } from "@src/interfaces/function.interface";
import taskService from "@src/services/task.service";
import logger from "@src/utils/logger";
import { Response, Request, NextFunction } from "express";

class taskController {
  public async create(
    req: IRequest,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const { body: data, user } = req;
      const payload: ITask = { ...data, user_id: user._id };
      const task = await taskService.saveOrUpdateTask(payload);
      return res.status(201).json({
        message: `Task Created Successfully`,
        data: task,
      });
    } catch (error) {
      logger.log("error", `Error in create task controller method: ${error}`);
      Next(error);
    }
  }
  public async update(
    req: IRequest,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const {
        body: data,
        paramIds: { taskId },
      } = req;

      const task = await taskService.saveOrUpdateTask(data, {
        _id: taskId,
      });
      return res.status(200).json({
        message: `Task updated Successfully`,
        data: task,
      });
    } catch (error) {
      logger.log("error", `Error in update task controller method: ${error}`);
      Next(error);
    }
  }
  public async delete(
    req: IRequest,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const {
        body: data,
        paramIds: { taskId },
      } = req;

      const task = await taskService.deleteOne({
        _id: taskId,
      });
      return res.status(200).json({
        message: `Task deleted Successfully`,
        data: task,
      });
    } catch (error) {
      logger.log("error", `Error in delete task controller method: ${error}`);
      Next(error);
    }
  }
  public async get(
    req: IRequest,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const {
        body: data,
        paramIds: { taskId },
      } = req;

      const task = await taskService.getOrError({
        _id: taskId,
      });
      return res.status(200).json({
        message: `Task Fetched Successfully`,
        data: task,
      });
    } catch (error) {
      logger.log("error", `Error in fetching task controller method: ${error}`);
      Next(error);
    }
  }
  public async index(
    req: IRequest,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const { filters, pageOpt } = req;
      const tasks = await taskService.getAll(filters, null, pageOpt);
      return res.status(200).json({
        message: `Tasks Retrieved Successfully`,
        data: tasks,
      });
    } catch (error) {
      logger.log(
        "error",
        `Error in retrieving task controller method: ${error}`
      );
      Next(error);
    }
  }
}

export default taskController;
