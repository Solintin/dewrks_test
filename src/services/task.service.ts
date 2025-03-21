import TaskModel, { ITask, ITaskDocument } from "@src/db/model/task.model";
import { BadRequestError } from "@src/errors";
import mongoose, { FilterQuery } from "mongoose";
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
      if (filterQuery) {
        return await this.updateExistingTask(filterQuery, data);
      }
      return await this.createNewTask(data);
    } catch (error) {
      throw new BadRequestError(
        `Error ${filterQuery ? 'updating' : 'creating'} task: ${error.message}`
      );
    }
  }

  private async updateExistingTask(
    filterQuery: FilterQuery<ITaskDocument>,
    data: Partial<ITask>
  ): Promise<ITaskDocument> {
    const existingTask = await this.TaskModel.findOne(filterQuery);
    if (!existingTask) {
      throw new BadRequestError("Task not found");
    }

    const statusTracker = existingTask.statusTracker || [];
    if (data.status && data.status !== existingTask.status) {
      statusTracker.push({
        status: data.status,
        updateAt: Date.now(),
      });
    }

    return await this.TaskModel.findOneAndUpdate(
      filterQuery,
      { ...data, statusTracker },
      {
        new: true,
        runValidators: true,
        upsert: false,
      }
    );
  }

  private async createNewTask(data: Partial<ITask>): Promise<ITaskDocument> {
    const task = new this.TaskModel({
      ...data,
      statusTracker: data.status
        ? [{ status: data.status, updateAt: Date.now() }]
        : [],
    });

    return await task.save();
  }

  public async countByStatus(userId: string): Promise<ITaskDocument[]> {
    try {
      return this.TaskModel.aggregate([
        {
          $match: { user_id: new mongoose.Types.ObjectId(userId) },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);
    } catch (error) {
      throw new BadRequestError("Error counting task: " + error.message);
    }
  }
}

export default new TaskService();
