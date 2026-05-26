/// <reference types="node" />
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import path from 'path';
export default defineConfig({
  schema: './src/schema/*.ts', // Ye folder 'lib/db/src/schema/' ko point karega
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_gTlf9r0QAqCk@ep-shiny-dust-apcz1n9m.c-7.us-east-1.aws.neon.tech/neondb?sslmode=requireen",
  },
});