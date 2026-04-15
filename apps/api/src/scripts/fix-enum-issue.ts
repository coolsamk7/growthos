import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config( { path: path.join( __dirname, '../../.env' ) } );

const dataSource = new DataSource( {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt( process.env.DATABASE_PORT || '5432' ),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
} );

async function fixEnumIssue() {
    try {
        await dataSource.initialize();
        console.log( '✓ Connected to database' );

        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();

        console.log( '\n🔍 Checking for enum conflicts...' );

        // Check if users table exists
        const tablesResult = await queryRunner.query( `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'users'
        ` );

        if ( tablesResult.length > 0 ) {
            console.log( '⚠️  Users table exists. Dropping it to recreate with correct enums...' );
            
            // Drop dependent objects first
            await queryRunner.query( `DROP TABLE IF EXISTS "refresh_tokens" CASCADE` );
            await queryRunner.query( `DROP TABLE IF EXISTS "users" CASCADE` );
            console.log( '  ✓ Dropped users and related tables' );
        }

        // Drop existing enums
        console.log( '\n🗑️  Dropping old enum types...' );
        await queryRunner.query( `DROP TYPE IF EXISTS "users_role_enum" CASCADE` );
        await queryRunner.query( `DROP TYPE IF EXISTS "users_status_enum" CASCADE` );
        console.log( '  ✓ Dropped old enums' );

        // Create new enums with correct values
        console.log( '\n✨ Creating new enum types...' );
        await queryRunner.query( `
            CREATE TYPE "users_role_enum" AS ENUM ('USER', 'CONTENT_CREATOR', 'ADMIN')
        ` );
        await queryRunner.query( `
            CREATE TYPE "users_status_enum" AS ENUM ('ACTIVE', 'INACTIVE')
        ` );
        console.log( '  ✓ Created new enums with correct values' );

        await queryRunner.release();
        await dataSource.destroy();

        console.log( '\n✅ Database enums fixed successfully!' );
        console.log( '📝 Now TypeORM synchronize will create tables with correct schema' );
        console.log( '\nYou can now run: yarn workspace @growthos/api dev\n' );
        
        process.exit( 0 );
    } catch ( error ) {
        console.error( '\n❌ Error fixing enum issue:', error );
        process.exit( 1 );
    }
}

fixEnumIssue();
