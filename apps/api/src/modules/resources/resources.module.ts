import { Module } from '@nestjs/common';
import { ResourcesController } from './controllers/v1/resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module({
    imports: [
        TypeOrmModule.forFeature([ResourceEntity]),
        CaslModule.forRoot(),
    ],
    controllers: [ResourcesController],
})
export class ResourcesModule {}
