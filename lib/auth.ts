import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index";
import * as schema from "./db/schema";
import { env } from "./validations/env";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
        ...schema
    }
  }),
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: false,
      }
    }
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()]
});
