import { ValidationError } from "../types";

export class ValidationErrorClass extends Error {
    issues: ValidationError[];
    
    constructor(issues: ValidationError[]) {
        super('Validation Failed')
        this.name = 'ValidationError';
        this.issues = issues
    }
}