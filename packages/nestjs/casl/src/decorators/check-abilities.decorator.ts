import { SetMetadata } from '@nestjs/common'
import { Action, Subject } from '../types.js'

export const CHECK_ABILITY = 'check_ability'

export interface RequiredRule {
    action: Action
    subject: Subject
}

export const CheckAbilities = ( ...requirements: RequiredRule[] ) =>
    SetMetadata( CHECK_ABILITY, requirements )
