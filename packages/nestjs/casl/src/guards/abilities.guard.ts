import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CaslAbilityFactory } from '../casl-ability.factory.js'
import { CHECK_ABILITY, RequiredRule } from '../decorators/check-abilities.decorator.js'

@Injectable()
export class AbilitiesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private abilityFactory: CaslAbilityFactory
    ) {}

    async canActivate( context: ExecutionContext ): Promise<boolean> {
        const rules = this.reflector.get<RequiredRule[]>( CHECK_ABILITY, context.getHandler() ) || []

        if ( !rules.length ) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user = request.user

        if ( !user ) {
            throw new ForbiddenException( 'User not authenticated' )
        }

        const ability = this.abilityFactory.defineAbility( user.role, user.id )

        const hasPermission = rules.every( ( rule ) =>
            ability.can( rule.action, rule.subject )
        )

        if ( !hasPermission ) {
            throw new ForbiddenException( 'Insufficient permissions' )
        }

        return true
    }
}
