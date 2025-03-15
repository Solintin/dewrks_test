import TaskModel, { ITask, ITaskDocument } from "@src/db/model/task.model";
import { BadRequestError } from "@src/errors";
import { FilterQuery } from "mongoose";
import BaseDocumentService from "./base.service";

class TaskService extends BaseDocumentService<ITaskDocument> {
  private TaskModel = TaskModel;
  constructor() {
    super("Task", TaskModel);
  }

  public async saveOrUpdateTask(
    data: Partial<ITask>,
    filterQuery?: FilterQuery<ITaskDocument>
  ): Promise<ITaskDocument> {
    try {
      let task;

      if (filterQuery) {
        const existingTask = await this.TaskModel.findOne(filterQuery);
        if (!existingTask) {
          throw new BadRequestError("Task not found");
        }

        data.statusTracker = existingTask.statusTracker || [];

        if (data.status && data.status !== existingTask.status) {
          data.statusTracker.push({
            status: data.status,
            updateAt: Date.now(),
          });
        }

        task = await this.TaskModel.findOneAndUpdate(filterQuery, data, {
          new: true,
          runValidators: true,
          upsert: false,
        });
      } else {
        task = new this.TaskModel({
          ...data,
          statusTracker: data.status
            ? [{ status: data.status, updateAt: Date.now() }]
            : [],
        });

        await task.save();
      }

      return task;
    } catch (error) {
      throw new BadRequestError("Error saving/updating task: " + error.message);
    }
  }
}

export default new TaskService();
