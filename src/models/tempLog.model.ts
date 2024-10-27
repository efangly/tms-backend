import { z } from "zod";

export const ZTempLog = z.object({
  mcuId: z.string().optional(),
  status: z.string().optional(),
  tempValue: z.string().optional(),
  realValue: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional()
});

export type TTempLog = z.infer<typeof ZTempLog>;