import { DynamicModule, Module } from '@nestjs/common'
import { CaslAbilityFactory } from './casl-ability.factory.js'

@Module( {} )
export class CaslModule {
    static forRoot(): DynamicModule {
        return {
            module: CaslModule,
            providers: [ CaslAbilityFactory ],
            exports: [ CaslAbilityFactory ],
            global: true,
        }
    }
}
