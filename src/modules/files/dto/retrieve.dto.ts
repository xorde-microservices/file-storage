import { IsHexadecimal, IsNotEmpty } from "class-validator";

export class FileRetriveParams {
	@IsNotEmpty()
	@IsHexadecimal({ always: true })
	id: string;

	constructor(id: string) {
		this.id = id;
	}
}
