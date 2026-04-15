import { Module } from '@nestjs/common';
import { UserTopicsController } from './controllers/v1/user-topics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTopicEntity } from '@growthos/nestjs-database/entities';
import { CaslModule } from '@growthos/nestjs-casl';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserTopicEntity]),
        CaslModule.forRoot(),
    ],
    controllers: [UserTopicsController],
})
export class UserTopicsModule {}
