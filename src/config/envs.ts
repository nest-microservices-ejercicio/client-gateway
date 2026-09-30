import 'dotenv/config';
import { z } from 'zod';

const envsSchema = z.object({
  PORT: z.coerce.number(),

  NATS_SERVERS: z
    .string()
    .transform((value) => value.split(',').map((server) => server.trim()))
    .pipe(z.array(z.string().min(1)).min(1)),

  // PRODUCTS_MS_HOST: z.string(),
  // PRODUCTS_MS_PORT: z.coerce.number(),
  // ORDERS_MS_HOST: z.string(),
  // ORDERS_MS_PORT: z.coerce.number(),
});

const result = envsSchema.safeParse(process.env);

if (!result.success) {
  throw new Error(
    `Config validation error: ${result.error.message}`,
  );
}

export const envs = {
  port: result.data.PORT,

  natsServers: result.data.NATS_SERVERS,  // string[]

  // products_ms_host: result.data.PRODUCTS_MS_HOST,
  // products_ms_port: result.data.PRODUCTS_MS_PORT,
  // orders_ms_host: result.data.ORDERS_MS_HOST,
  // orders_ms_port: result.data.ORDERS_MS_PORT,
};