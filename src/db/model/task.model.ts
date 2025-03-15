import { status } from "@src/interfaces/enum.interface";
import { Schema, model, Document, Model, SchemaTypes } from "mongoose";
import { IUser } from "./user.model";

export interface ITask {
  title: string;
  description?: string;
  status: status;
  user_id: IUser;
}

export interface ITaskDocument extends ITask, Document {}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },

    status: {
      type: String,
      enum: Object.values(status),
      default: status.PENDING,
    },
    description: { type: String, default: "" },
    user_id: { type: SchemaTypes.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const TaskModel: Model<ITaskDocument> = model<ITaskDocument>(
  "Task",
  TaskSchema
);

export default TaskModel;
