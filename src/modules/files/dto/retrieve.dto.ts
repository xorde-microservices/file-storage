import { IsHexadecimal, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FileRetrieveParams {
	@IsNotEmpty()
	@IsHexadecimal({ always: true })
	@ApiProperty()
	id: string;

	constructor(id: string) {
		this.id = id;
	}
}

export class FileRetrieveArgs {
	@ApiProperty({ required: false, default: false, description: "Retrieve thumb (boundary 100x100) for image" })
	thumb: string | boolean;
}
