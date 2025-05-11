import { StandardSchemaV1 } from "../../types/standard-schema.js";

export async function parseStandardSchema<TSchema extends StandardSchemaV1>(
	schema: TSchema,
	input: StandardSchemaV1.InferInput<TSchema>,
): Promise<StandardSchemaV1.InferOutput<TSchema>> {
	let result = await schema["~standard"].validate(input);

	if (result.issues) {
		throw new ValidationError(result.issues);
	}
	return result.value;
}

export class ValidationError extends Error {
	public readonly issues: ReadonlyArray<StandardSchemaV1.Issue>;

	constructor(issues: ReadonlyArray<StandardSchemaV1.Issue>, message?: string) {
		// Create a more descriptive message if one wasn't provided
		const defaultMessage = issues.length > 0 
			? `Validation failed with ${issues.length} issues:\n${issues.map(i => 
				`- ${i.path?.join('.')}: ${i.message}`).join('\n')}`
			: 'Validation failed with unknown issues';
			
		super(message || defaultMessage);
		this.issues = issues;
		this.name = 'ValidationError';
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}