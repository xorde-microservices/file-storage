import { Injectable, CanActivate } from '@nestjs/common';

/**
 * Dummy guard that will always return true (allow access).
 */
@Injectable()
export class DummyGuard implements CanActivate {
	canActivate(): boolean {
		return true;
	}
}
