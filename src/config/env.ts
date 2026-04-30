import { z } from "zod";

const schema = z.object({
  VITE_APP_ENV: z.enum(["production", "staging"]),

  VITE_API_URL: z.string().min(1),
  VITE_LIVE_TRACKING_API_URL: z.string().min(1),

  VITE_GOOGLE_MAP_API_KEY: z.string().min(1),

  VITE_FIREBASE_API_KEY: z.string().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  VITE_FIREBASE_APP_ID: z.string().min(1),
  VITE_FIREBASE_MEASUREMENT_ID: z.string().min(1),
  VITE_FIREBASE_VAPID_KEY: z.string().min(1),
});

const result = schema.safeParse(import.meta.env);

if (!result.success) {
  console.error("Invalid environment variables", result.error.format());
  throw new Error("Invalid environment variables");
}

const env = result.data;

export const ENV = {
  APP_ENV: env.VITE_APP_ENV,

  IS_PROD: env.VITE_APP_ENV === "production",
  IS_STAGING: env.VITE_APP_ENV === "staging",

  API_URL: env.VITE_API_URL,
  LIVE_TRACKING_API_URL: env.VITE_LIVE_TRACKING_API_URL,

  GOOGLE_MAP_API_KEY: env.VITE_GOOGLE_MAP_API_KEY,

  FIREBASE: {
    API_KEY: env.VITE_FIREBASE_API_KEY,
    AUTH_DOMAIN: env.VITE_FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID,
    STORAGE_BUCKET: env.VITE_FIREBASE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    APP_ID: env.VITE_FIREBASE_APP_ID,
    MEASUREMENT_ID: env.VITE_FIREBASE_MEASUREMENT_ID,
    VAPID_KEY: env.VITE_FIREBASE_VAPID_KEY,
  },
};
