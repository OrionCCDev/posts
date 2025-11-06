import {z} from 'zod';
export const registerSchema = z.object({
  username: z.string()
    .nonempty({ message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z.string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string()
    .nonempty({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;