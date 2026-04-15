import { Command, CommandRunner, SubCommand } from 'nest-commander';
import { SeedDbCommand } from './seed.cmd';


@Command( {
    name: 'db',
    subCommands: [
        SeedDbCommand,
    ],
} )
export class DbRootCommand extends CommandRunner {
    async run( passedParams: string[], options?: Record<string, any> ) {
        //
    }
}
