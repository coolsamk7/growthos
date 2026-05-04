import Type from 'typebox';
import { ModuleStatus } from '@growthos/nestjs-shared';

export const CreateUserModuleRequest = Type.Object( {
    userLearningPathId: Type.String(),
    masterModuleId: Type.Optional( Type.String() ),
    name: Type.String( { minLength: 1, maxLength: 255 } ),
    description: Type.Optional( Type.String() ),
    orderIndex: Type.Optional( Type.Number( { minimum: 0 } ) ),
} );

export const UpdateUserModuleRequest = Type.Object( {
    name: Type.Optional( Type.String( { minLength: 1, maxLength: 255 } ) ),
    description: Type.Optional( Type.String() ),
    status: Type.Optional( Type.Enum( ModuleStatus ) ),
    orderIndex: Type.Optional( Type.Number( { minimum: 0 } ) ),
    startedAt: Type.Optional( Type.String( { format: 'date-time' } ) ),
    completedAt: Type.Optional( Type.String( { format: 'date-time' } ) ),
} );

const UserModuleSchema = Type.Object( {
    id: Type.String(),
    userLearningPathId: Type.String(),
    masterModuleId: Type.Optional( Type.String() ),
    name: Type.String(),
    description: Type.Optional( Type.String() ),
    status: Type.Enum( ModuleStatus ),
    progress: Type.Number(),
    orderIndex: Type.Number(),
    startedAt: Type.Optional( Type.String() ),
    completedAt: Type.Optional( Type.String() ),
    createdAt: Type.String(),
    updatedAt: Type.String(),
    deletedAt: Type.Optional( Type.String() ),
} );

export const CreateUserModuleResponse = Type.Object( {
    message: Type.String(),
    data: UserModuleSchema,
} );

export const UpdateUserModuleResponse = Type.Object( {
    message: Type.String(),
    data: UserModuleSchema,
} );

export const GetUserModuleResponse = UserModuleSchema;

export const GetUserModulesResponse = Type.Object( {
    data: Type.Array( UserModuleSchema ),
    total: Type.Number(),
    page: Type.Number(),
    limit: Type.Number(),
    totalPages: Type.Number(),
} );

export const DeleteUserModuleResponse = Type.Object( {
    message: Type.String(),
} );
