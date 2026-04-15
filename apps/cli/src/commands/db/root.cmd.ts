import { Command, CommandRunner, SubCommand } from 'nest-commander';
import { SeedDbCommand } from './seed.cmd';
import { CreateUsersCommand } from './create-users.cmd';


@Command( {
    name: 'db',
    subCommands: [
        SeedDbCommand,
        CreateUsersCommand,
    ],
} )
export class DbRootCommand extends CommandRunner {
    async run( passedParams: string[], options?: Record<string, any> ) {
        //
    }
}
