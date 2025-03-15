import { BadRequestError } from "@src/errors";
import UserModel, { IUser, IUserDocument } from "../db/model/user.model";
import bcrpyt from "bcryptjs";
import BaseDocumentService from "./base.service";
import { authConfig } from "@src/configs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { DecodedAuthToken } from "@src/interfaces/function.interface";

class AuthService extends BaseDocumentService<IUserDocument> {
  private UserModel = UserModel;
  constructor() {
    super("User", UserModel);
  }
  public AuthEncryptKey = fs
    .readFileSync(path.join(process.cwd(), "private.key"))
    .toString();

  public async signUp(data: IUser): Promise<IUserDocument> {
    const newUser = new this.UserModel({
      ...data,
    });
    await newUser.save();
    return newUser;
  }

  public async getUserForLogin(
    email: string,
    password: string
  ): Promise<IUserDocument> {
    const user = await this.UserModel.findOne({ email }).select("+password");
    if (!user || !this.validatePassword(user, password)) {
      throw new BadRequestError("Email or password is incorrect");
    }
    return user;
  }

  public async login(user: IUserDocument) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userPayload } = user.toObject();

    const accessToken = this.generateAccessToken(userPayload as IUserDocument);

    return { user, accessToken };
  }

  public validatePassword(user: IUserDocument, password: string) {
    try {
      return bcrpyt.compareSync(password, user.password);
    } catch (error) {
      return false;
    }
  }

  private generateAccessToken(user: IUserDocument): string {
    const accessToken = jwt.sign({ ...user }, this.AuthEncryptKey, {
      algorithm: "RS256",
      expiresIn: "1h",
    });

    return accessToken;
  }

  public verifyAccessToken(token: string): DecodedAuthToken {
    try {
      const payload = jwt.verify(
        token,
        this.AuthEncryptKey
      ) as unknown as IUserDocument;
      return {
        payload,
        expired: false,
      };
    } catch (error) {
      return {
        payload: null,
        expired: error.message.includes("expired") ? error.message : error,
      };
    }
  }
}

export default new AuthService();
