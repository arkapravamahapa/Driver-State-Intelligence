export const env = {
  PORT: Number(process.env.PORT) || 3000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  HF_TOKEN: process.env.HF_TOKEN
};