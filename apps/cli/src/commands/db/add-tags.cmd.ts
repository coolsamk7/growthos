import { CommandRunner } from "nest-commander";
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from "typeorm";

export class AddTagsCommandRunner extends CommandRunner {
    constructor(
        @InjectDataSource private readonly datasource: DataSource
    ){
        super();
    }

    async run() {

    }
} 
