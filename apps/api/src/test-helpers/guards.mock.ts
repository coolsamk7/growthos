import { CanActivate, ExecutionContext } from '@nestjs/common';

export class MockAbilitiesGuard implements CanActivate {
  canActivate( context: ExecutionContext ): boolean {
    return true;
  }
}
