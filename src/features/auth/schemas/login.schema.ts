import { z } from 'zod';

export const loginSchema = z.object({
  email: z
  .string()
  .trim()
  .min(1, { message: 'Email không được để trống' })
  .email({ message: 'Email không hợp lệ' }),
password: z
  .string()
  .trim()
  .min(6, { message: 'Tối thiểu 6 ký tự' })
});
