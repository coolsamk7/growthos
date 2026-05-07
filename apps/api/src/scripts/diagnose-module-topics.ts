import { DataSource } from 'typeorm';
import { UserModuleEntity, UserTopicEntity, UserProblemEntity, UserLearningPathEntity } from '@growthos/nestjs-database/entities';

export async function diagnoseModuleTopics( dataSource: DataSource ) {
    console.log( '=== Diagnosing Module-Topic-Problem Relationships ===' );
    
    // Get all user learning paths
    const learningPaths = await dataSource.manager.find( UserLearningPathEntity );
    console.log( `\nTotal Learning Paths: ${learningPaths.length}` );
    
    for ( const path of learningPaths ) {
        console.log( `\n--- Learning Path: ${path.name} (User: ${path.userId}) ---` );
        
        // Get modules for this path
        const modules = await dataSource.manager.find( UserModuleEntity, {
            where: { userLearningPathId: path.id },
            order: { orderIndex: 'ASC' }
        } );
        
        console.log( `  Modules: ${modules.length}` );
        
        for ( const module of modules ) {
            console.log( `    - ${module.name} (ID: ${module.id})` );
            
            // Get topics for this module
            const topics = await dataSource.manager.find( UserTopicEntity, {
                where: { userModuleId: module.id }
            } );
            
            console.log( `      Topics: ${topics.length}` );
            
            for ( const topic of topics ) {
                // Check if topic has correct userLearningPathId
                if ( topic.userLearningPathId !== path.id ) {
                    console.log( `      ❌ MISMATCH: Topic "${topic.name}" has wrong userLearningPathId` );
                    console.log( `         Expected: ${path.id}, Got: ${topic.userLearningPathId}` );
                }
                
                // Get problems for this topic
                const problems = await dataSource.manager.find( UserProblemEntity, {
                    where: { userTopicId: topic.id }
                } );
                
                console.log( `        - ${topic.name}: ${problems.length} problems` );
            }
        }
        
        // Check for orphaned topics (topics with userLearningPathId but wrong userModuleId)
        const allPathTopics = await dataSource.manager.find( UserTopicEntity, {
            where: { userLearningPathId: path.id }
        } );
        
        const moduleIds = new Set( modules.map( m => m.id ) );
        const orphanedTopics = allPathTopics.filter( t => t.userModuleId && !moduleIds.has( t.userModuleId ) );
        
        if ( orphanedTopics.length > 0 ) {
            console.log( `  ⚠️  Found ${orphanedTopics.length} orphaned topics:` );
            orphanedTopics.forEach( t => {
                console.log( `    - "${t.name}" has userModuleId: ${t.userModuleId} (not in current modules)` );
            } );
        }
    }
    
    console.log( '\n=== Diagnosis Complete ===' );
}
