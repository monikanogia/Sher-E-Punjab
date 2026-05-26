/// <reference types="node" />

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema/index.ts', // Sirf relative path use karein
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
// Isse replace karein:
   url: (process.env.DATABASE_URL as string),
  },
});