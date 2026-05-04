import { DataSource } from 'typeorm';

async function migrateTopicsToModules() {
    // Create DataSource - adjust these values to match your .env
    const dataSource = new DataSource( {
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt( process.env.DATABASE_PORT || '5432' ),
        username: process.env.DATABASE_USERNAME || 'growthos',
        password: process.env.DATABASE_PASSWORD || '123456789',
        database: process.env.DATABASE_NAME || 'growthos',
    } );

    try {
        console.log( '📦 Connecting to database...' );
        await dataSource.initialize();
        console.log( '✅ Connected to database\n' );

        // Check if user_module_id column exists
        const columnCheck = await dataSource.query( `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'user_topics' 
            AND column_name = 'user_module_id'
        ` );

        if ( columnCheck.length === 0 ) {
            console.log( '⚠️  Column user_module_id does not exist yet.' );
            console.log( '   Please start the API server first to let TypeORM create the column.' );
            console.log( '   Run: yarn workspace @growthos/api dev' );
            await dataSource.destroy();
            return;
        }

        console.log( '✅ Column user_module_id exists\n' );

        // Find all topics without a userModuleId
        const topicsWithoutModule = await dataSource.query( `
            SELECT id, name, user_learning_path_id, user_module_id
            FROM user_topics
            WHERE user_module_id IS NULL
            AND deleted_at IS NULL
        ` );

        console.log( `📊 Found ${topicsWithoutModule.length} topics without a module assignment\n` );

        if ( topicsWithoutModule.length === 0 ) {
            console.log( '✨ All topics are already assigned to modules!' );
            await dataSource.destroy();
            return;
        }

        // Group topics by learning path
        const topicsByLearningPath: Record<string, any[]> = {};
        for ( const topic of topicsWithoutModule ) {
            const pathId = topic.user_learning_path_id;
            if ( !topicsByLearningPath[pathId] ) {
                topicsByLearningPath[pathId] = [];
            }
            topicsByLearningPath[pathId].push( topic );
        }

        console.log( '🔄 Processing topics by learning path...\n' );

        for ( const [ learningPathId, topics ] of Object.entries( topicsByLearningPath ) ) {
            console.log( `\n📚 Learning Path: ${learningPathId}` );
            console.log( `   Topics to migrate: ${topics.length}` );

            // Find or create a default module for this learning path
            const existingModules = await dataSource.query( `
                SELECT id, name
                FROM user_modules
                WHERE user_learning_path_id = $1
                AND name = 'Uncategorized Topics'
                AND deleted_at IS NULL
                LIMIT 1
            `, [ learningPathId ] );

            let moduleId: string;

            if ( existingModules.length > 0 ) {
                moduleId = existingModules[0].id;
                console.log( `   ✅ Using existing module: ${moduleId}` );
            } else {
                console.log( '   📝 Creating "Uncategorized Topics" module...' );
                const newModules = await dataSource.query( `
                    INSERT INTO user_modules (
                        id, user_learning_path_id, name, description, 
                        status, progress, order_index, created_at, updated_at
                    )
                    VALUES (
                        gen_random_uuid(), $1, $2, $3, 
                        $4, $5, $6, NOW(), NOW()
                    )
                    RETURNING id
                `, [
                    learningPathId,
                    'Uncategorized Topics',
                    'Topics that were created before module organization',
                    'IN_PROGRESS',
                    0,
                    999
                ] );
                moduleId = newModules[0].id;
                console.log( `   ✅ Created module: ${moduleId}` );
            }

            // Update all topics to use this module
            for ( const topic of topics ) {
                await dataSource.query( `
                    UPDATE user_topics
                    SET user_module_id = $1, updated_at = NOW()
                    WHERE id = $2
                `, [ moduleId, topic.id ] );
                console.log( `      ✓ Assigned topic "${topic.name}" to module` );
            }

            console.log( `   ✅ Migrated ${topics.length} topics` );
        }

        console.log( '\n\n✨ Migration completed successfully!' );
        console.log( '\n📋 Summary:' );
        console.log( `   - Topics migrated: ${topicsWithoutModule.length}` );
        console.log( `   - Learning paths affected: ${Object.keys( topicsByLearningPath ).length}` );
        console.log( '\n💡 Note: Topics have been assigned to "Uncategorized Topics" modules.' );
        console.log( '   You can move them to other modules via the UI if needed.\n' );

        await dataSource.destroy();
    } catch ( error ) {
        console.error( '❌ Migration failed:', error );
        await dataSource.destroy();
        process.exit( 1 );
    }
}

// Run the migration
migrateTopicsToModules()
    .then( () => {
        console.log( '👋 Done!' );
        process.exit( 0 );
    } )
    .catch( ( error ) => {
        console.error( '💥 Fatal error:', error );
        process.exit( 1 );
    } );
