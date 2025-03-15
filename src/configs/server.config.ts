import { config } from "dotenv";
config();

class ServerConfig {
  public NODE_ENV = process.env.NODE_ENV || "development";

  public HOST = process.env.HOST || "localhost";

  public PORT = process.env.PORT;

  public APP_VERSION = process.env.APP_VERSION;

  public BASE_URL = `${this.HOST}/v${this.APP_VERSION}`;

  public ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

  public MAX_REQUESTS_PER_MINUTE = Number(process.env.MAX_REQUESTS_PER_MINUTE);
}

export default new ServerConfig();
