import { config } from "dotenv";
config();

class AuthConfig {
  public AUTH_SECRET = process.env.AUTH_SECRET;

  public BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);

  public ACCESS_TOKEN_EXPIRES_IN = "1h";

  public ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
}

export default new AuthConfig();
