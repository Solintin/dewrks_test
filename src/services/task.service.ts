import TaskModel, { ITask, ITaskDocument } from "@src/db/model/task.model";
import UserModel from "@src/db/model/user.model";
import { BadRequestError } from "@src/errors";
import { FilterQuery } from "mongoose";
import BaseDocumentService from "./base.service";

// ✅ Fix: Use `ITaskDocument` Instead of `ITask`
class TaskService extends BaseDocumentService<ITaskDocument> {
  private TaskModel = TaskModel;
  private UserModel = UserModel;
  constructor() {
    super("Task", TaskModel);
  }

  public async saveOrUpdateTask(
    data: Partial<ITask>, // Allow partial data for updates
    filterQuery?: FilterQuery<ITaskDocument> // Optional filter for updates
  ): Promise<ITaskDocument> {
    // try {
    let Task;

    if (filterQuery) {
      const isExist = await this.TaskModel.findOne({
        ...filterQuery,
      });
      if (!isExist) {
        throw new BadRequestError("Task not found");
      }

      Task = await this.TaskModel.findOneAndUpdate(filterQuery, data, {
        new: true, // Return updated document
        runValidators: true, // Ensure validation
      });
    } else {
      Task = new this.TaskModel(data);
      await Task.save();
    }
    return Task;
    // } catch (error) {
    //   throw new BadRequestError("Error:" + error);
    // }
  }
}

export default new TaskService();
