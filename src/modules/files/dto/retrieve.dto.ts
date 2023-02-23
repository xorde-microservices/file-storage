import { IsHexadecimal, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MAX_THUMB_SIZE, MIN_THUMB_SIZE } from '../files.service';

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
	@ApiProperty({
		required: false,
		description:
			'Retrieve thumb of an image sized to [thumb]x[thumb] box. ' + `Range: ${MIN_THUMB_SIZE}-${MAX_THUMB_SIZE}`,
		maximum: MAX_THUMB_SIZE,
		minimum: MIN_THUMB_SIZE,
	})
	@IsOptional()
	@IsNumberString()
	thumb: number;
}
