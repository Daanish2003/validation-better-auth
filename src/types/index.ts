import { ZodError } from "zod";
import * as yup from "yup";

export type ValidationResult<T = any> = { 
  data?: T; 
  error?: ZodError | yup.ValidationError | { message: string; details?: unknown }; 
};

export type ValidationAdapter = {
  validate: (data: unknown) => Promise<ValidationResult>;
};

export type ValidationConfig = {
  path: string;
  adapter: ValidationAdapter;
};