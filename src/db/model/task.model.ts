import { status } from "@src/interfaces/enum.interface";
import mongoose, {
  Schema,
  model,
  Document,
  Model,
  SchemaTypes,
} from "mongoose";
import { IUser } from "./user.model";

export interface ITask {
  title: string;
  description?: string;
  status: status;
  user_id: IUser;
  statusTracker?: { status: string; updateAt: number }[];
}

export interface ITaskDocument extends ITask, Document {}

const statusTrackerSchema = new mongoose.Schema({
  status: { type: String },
  updateAt: { type: Date },
});

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    statusTracker: [statusTrackerSchema],

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
