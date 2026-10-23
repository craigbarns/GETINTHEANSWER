export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.getintheanswer.com").replace(/\/+$/, "");

export const SITE_NAME = "GetInTheAnswer";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";
