import { CommandRunner, SubCommand } from "nest-commander";
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, Repository } from "typeorm";
import { warn } from "console";
import { TagEntity } from "@growthos/nestjs-database/entities";

export const DEFAULT_TAGS = [
  // Topics
  { name: 'DSA', category: 'TOPIC', color: '#3B82F6' },
  { name: 'React', category: 'TOPIC', color: '#3B82F6' },
  { name: 'Node.js', category: 'TOPIC', color: '#3B82F6' },
  { name: 'Mathematics', category: 'TOPIC', color: '#3B82F6' },

  // Types
  { name: 'Practice', category: 'TYPE', color: '#8B5CF6' },
  { name: 'Revision', category: 'TYPE', color: '#8B5CF6' },
  { name: 'Mock Test', category: 'TYPE', color: '#8B5CF6' },

  // Difficulty
  { name: 'Easy', category: 'DIFFICULTY', color: '#10B981' },
  { name: 'Medium', category: 'DIFFICULTY', color: '#F59E0B' },
  { name: 'Hard', category: 'DIFFICULTY', color: '#EF4444' },

  // Goals
  { name: 'FAANG Prep', category: 'GOAL', color: '#EC4899' },
  { name: 'Board Exam', category: 'GOAL', color: '#EC4899' },
];

@SubCommand( { name: 'add-tags' } )
export class AddTagsCommand extends CommandRunner {
    constructor(
        @InjectDataSource() private readonly datasource: DataSource
    ){
        super();
    }

    async run() {
        const tagsRepository = this.datasource.getRepository( TagEntity );
        
        console.log( 'Starting to add default tags...' );
        
        for ( const tagData of DEFAULT_TAGS ) {
            const existingTag = await tagsRepository.findOne( {
                where: { name: tagData.name }
            } );
            
            if ( existingTag ) {
                console.log( `Tag '${tagData.name}' already exists, skipping...` );
                continue;
            }
            
            const tag = tagsRepository.create( {
                name: tagData.name,
                category: tagData.category,
                color: tagData.color,
                usageCount: 0
            } );
            
            await tagsRepository.save( tag );
            console.log( `Added tag: ${tag.name} (${tag.category})` );
        }
        
        console.log( 'Finished adding default tags!' );
    }
} 
