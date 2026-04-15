import { Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CommandRunner, InquirerService, Option, SubCommand } from 'nest-commander';
import { DataSource } from 'typeorm';
import { SeederConstructor } from 'typeorm-extension';

@SubCommand( { name: 'seed' } )
export class SeedDbCommand extends CommandRunner {
    private readonly logger = new Logger( SeedDbCommand.name );
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {
        super();
    }


    async run( _passedParams: string[], options?: Record<string, any> ) {
        // const pathRepo = this.dataSource.getRepository( MasterLearningPathEntity );
        // const moduleRepo = this.dataSource.getRepository( MasterModuleEntity );
        // const itemRepo = this.dataSource.getRepository( MasterItemEntity );
        //
        // const filePath = path.join( __dirname, '../../data/master_dataset.xlsx.csv' );
        //
        // console.log( '🌱 Reading CSV...' );
        //
        // const rows: any[] = [];
        //
        // await new Promise<void>( ( resolve, reject ) => {
        //     fs.createReadStream( filePath )
        //         .pipe( csv() )
        //         .on( 'data', ( data ) => rows.push( data ) )
        //         .on( 'end', () => resolve() )
        //         .on( 'error', reject );
        // } );
        // console.log( rows )
        //
        // if ( !rows.length ) {
        //     console.log( '❌ No data found' );
        //     return;
        // }
        //
        // const learningPathTitle = rows[0].learning_path;
        //
        // // Create / find learning path
        // let learningPath = await pathRepo.findOne( {
        //     where: { title: learningPathTitle },
        // } );
        //
        // if ( !learningPath ) {
        //     learningPath = pathRepo.create( {
        //         title: learningPathTitle,
        //         description: 'Seeded from CSV',
        //     } );
        //     await pathRepo.save( learningPath );
        //     console.log( '✅ Learning path created' );
        // }
        //
        // // Group by module
        // const moduleMap = new Map<string, any[]>();
        //
        // for ( const row of rows ) {
        //     const moduleName = row.module?.trim();
        //
        //     if ( !moduleMap.has( moduleName ) ) {
        //         moduleMap.set( moduleName, [] );
        //     }
        //
        //     moduleMap.get( moduleName )?.push( row );
        // }
        //
        // console.log( `📦 Found ${moduleMap.size} modules` );
        //
        // // Insert modules + items
        // for ( const [ moduleName, items ] of moduleMap.entries() ) {
        //     let module = await moduleRepo.findOne( {
        //         where: {
        //             title: moduleName,
        //             masterLearningPathId: learningPath.id,
        //         },
        //     } );
        //
        //     if ( !module ) {
        //         module = moduleRepo.create( {
        //             title: moduleName,
        //             masterLearningPathId: learningPath.id,
        //             order: 1,
        //         } );
        //
        //         await moduleRepo.save( module );
        //         console.log( `📁 Module created: ${moduleName}` );
        //     }
        //
        //     const itemEntities = items.map( ( item, index ) =>
        //         itemRepo.create( {
        //             title: item.item_title,
        //             type: this.mapType( item.type ),
        //             difficulty: this.mapDifficulty( item.difficulty ),
        //             masterModuleId: module.id,
        //             order: Number( item.order ) || index + 1,
        //         } )
        //     );
        //
        //     // Bulk insert
        //     await itemRepo
        //         .createQueryBuilder()
        //         .insert()
        //         .values( itemEntities )
        //         .orIgnore()
        //         .execute();
        //
        //     console.log( `🔥 Inserted ${itemEntities.length} items in ${moduleName}` );
        // }
        //
        console.log( '🎉 CSV Seeding completed' );
    }

   }
