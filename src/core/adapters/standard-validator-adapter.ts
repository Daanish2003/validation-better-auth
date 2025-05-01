import { StandardSchemaV1 } from "../../types/standard-schema";

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
		super(message || JSON.stringify(issues, null, 2));
		this.issues = issues;
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}

