import { AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects, PureAbility } from '@casl/ability'
import { Action, Subject, UserRole } from './types.js'

type Subjects = InferSubjects<Subject> | 'all'

export type AppAbility = PureAbility<[Action, Subjects]>

export class AbilityFactory {
    defineAbility( role: UserRole, userId?: string ) {
        const { can, cannot, build } = new AbilityBuilder<AppAbility>(
            PureAbility as AbilityClass<AppAbility>
        )

        switch ( role ) {
            case UserRole.ADMIN:
                can( Action.MANAGE, Subject.ALL )
                break

            case UserRole.CONTENT_CREATOR:
                // Content creators can manage learning paths and master templates
                can( Action.MANAGE, Subject.LEARNING_PATH )
                can( Action.MANAGE, Subject.MASTER_LEARNING_PATH )
                can( Action.MANAGE, Subject.MASTER_TOPIC )
                can( Action.MANAGE, Subject.MASTER_PROBLEM )
                can( Action.MANAGE, Subject.TAG )

                // Can read user data for analytics
                can( Action.READ, Subject.USER )
                can( Action.READ, Subject.USER_LEARNING_PATH )
                can( Action.READ, Subject.USER_TOPIC )
                can( Action.READ, Subject.USER_PROBLEM )

                // Can manage their own user data
                can( Action.MANAGE, Subject.USER_LEARNING_PATH )
                can( Action.MANAGE, Subject.USER_TOPIC )
                can( Action.MANAGE, Subject.USER_PROBLEM )
                can( Action.MANAGE, Subject.PROBLEM_ATTEMPT )
                can( Action.MANAGE, Subject.STUDY_SESSION )
                can( Action.MANAGE, Subject.STREAK )
                can( Action.MANAGE, Subject.GOAL )
                can( Action.MANAGE, Subject.NOTE )
                can( Action.MANAGE, Subject.RESOURCE )
                break

            case UserRole.USER:
                // Users can read public learning paths and master templates
                can( Action.READ, Subject.LEARNING_PATH )
                can( Action.READ, Subject.MASTER_LEARNING_PATH )
                can( Action.READ, Subject.MASTER_TOPIC )
                can( Action.READ, Subject.MASTER_PROBLEM )
                can( Action.READ, Subject.TAG )

                // Users can only manage their own data
                can( Action.MANAGE, Subject.USER_LEARNING_PATH )
                can( Action.MANAGE, Subject.USER_TOPIC )
                can( Action.MANAGE, Subject.USER_PROBLEM )
                can( Action.MANAGE, Subject.PROBLEM_ATTEMPT )
                can( Action.MANAGE, Subject.STUDY_SESSION )
                can( Action.MANAGE, Subject.STREAK )
                can( Action.MANAGE, Subject.GOAL )
                can( Action.MANAGE, Subject.NOTE )
                can( Action.MANAGE, Subject.RESOURCE )
                
                // Can update their own profile
                can( Action.UPDATE, Subject.USER )
                can( Action.READ, Subject.USER )

                // Cannot delete their own account (requires admin)
                cannot( Action.DELETE, Subject.USER )
                break

            default:
                // No permissions for unknown roles
                break
        }

        return build( {
            detectSubjectType: ( item ) => item as ExtractSubjectType<Subjects>,
        } )
    }
}
