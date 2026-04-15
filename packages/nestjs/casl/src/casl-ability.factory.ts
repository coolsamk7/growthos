import { Injectable } from '@nestjs/common'
import { AbilityFactory } from './ability.factory.js'

@Injectable()
export class CaslAbilityFactory extends AbilityFactory {}
