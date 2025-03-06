import { SetMetadata } from '@nestjs/common';

// Décorateur pour spécifier les rôles autorisés
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
