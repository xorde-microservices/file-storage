import { ApiProperty } from '@nestjs/swagger';

export class CookieArgs {
	@ApiProperty({ description: 'JWT' })
	jwt: string;
}
