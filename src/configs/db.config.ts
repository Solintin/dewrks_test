import { config } from "dotenv";
config();

class DBConfig {
  public DB_URI = process.env.MONGO_URI;
}

export default new DBConfig();
