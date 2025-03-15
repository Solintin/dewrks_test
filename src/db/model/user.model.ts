import { Schema, model, Document, Model } from "mongoose";
import bcrpyt from "bcryptjs";
import { authConfig } from "@src/configs";
export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { unique: true, type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre<IUserDocument>("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrpyt.genSalt(authConfig.BCRYPT_SALT_ROUNDS);
      this.password = await bcrpyt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.set("toJSON", {
  transform(_, ret) {
    delete ret.password;
  },
});

const UserModel: Model<IUserDocument> = model<IUserDocument>(
  "User",
  UserSchema
);

export default UserModel;
