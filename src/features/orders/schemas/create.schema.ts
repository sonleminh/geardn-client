import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z
  .string()
  .trim()
  .min(6, { message: 'Tên không được để trống' }),
phoneNumber: z
  .string()
  .trim()
  .min(10, { message: 'Tối thiểu 10 ký tự' }),
  email: z
  .string()
  .trim()
  .min(1, { message: 'Email không được để trống' })
  .email({ message: 'Email không hợp lệ' }),
   shipment: z.object({
    method: z
      .number()
      .int()
      .min(1, { message: 'Phương thức giao hàng không hợp lệ' }),
    address: z
      .string()
      .trim()
      .min(1, { message: 'Địa chỉ không được để trống' }),
    // deliveryDate: z.coerce.date({
    //   required_error: 'Ngày giao không hợp lệ',
    //   invalid_type_error: 'Ngày giao không hợp lệ',
    // }),
  }),
});
