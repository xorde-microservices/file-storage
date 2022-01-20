import { IsHexadecimal, IsNotEmpty, IsNumberString, IsOptional } from "class-validator";
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
	@ApiProperty({ required: false, description: "Retrieve thumb of an image sized to [thumb]x[thumb] box" })
	@IsOptional()
	@IsNumberString()
	thumb: number;
}
