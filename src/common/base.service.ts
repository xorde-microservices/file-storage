import { Logger } from "@nestjs/common";

export class BaseService {
	protected readonly logger = new Logger(this.constructor.name);
}
