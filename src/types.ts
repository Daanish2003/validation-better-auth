export type ValidationError = {
    field?: string,
    message: string
 };
 
 export interface ValidationAdapter {
   validate: (data: Record<string, any>) => Promise<void | ValidationError[]> | void | ValidationError[];
   formatError?: (error: ValidationError[]) => Record<string, unknown> | ValidationError[];
 }
 
 export interface ValidationConfig {
   path: string;
   adapter: ValidationAdapter;
 }