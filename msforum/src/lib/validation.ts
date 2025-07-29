// src/lib/validation.ts
import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Lo username deve contenere almeno 2 caratteri." })
    .trim(),
  email: z
    .email({ message: "Inserisci un'email valida." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "La password deve contenere almeno 8 caratteri." })
    .regex(/[a-zA-Z]/, { message: "Deve contenere almeno una lettera." })
    .regex(/[0-9]/, { message: "Deve contenere almeno un numero." })
    .regex(/[^a-zA-Z0-9]/, { message: "Deve contenere almeno un carattere speciale." })
    .trim(),
});

export type SignUpData = z.infer<typeof signUpSchema>;
