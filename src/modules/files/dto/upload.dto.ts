import { ApiProperty } from "@nestjs/swagger";

export class FileUploadDto {
	@ApiProperty({ type: "string", format: "binary" })
	file: any;
}

export class FileUploadResponseDto {
	@ApiProperty({ description: "Unique ID of the file" })
	id: string;

	@ApiProperty()
	size: number;

	constructor(id: string, size: number) {
		this.id = id;
		this.size = size;
	}
}
