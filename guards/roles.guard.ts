import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/user/guard/jwt-aut.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user.user; // L'utilisateur est attaché à la requête après l'authentification JWT

        console.log(user)
        // Récupère les rôles autorisés
        const roles = this.getRoles(context);

        if (!roles || roles.length === 0) {
            return true; // Si aucun rôle n'est spécifié, l'accès est autorisé
        }

        // Vérifie si l'utilisateur a un des rôles requis
        if (!user || !roles.includes(user.role)) { 
            throw new ForbiddenException('Accès interdit');  // Si l'utilisateur n'a pas les bons rôles
        }

        return true; // L'utilisateur a les bons rôles
    }
 
    private getRoles(context: ExecutionContext): string[] {
        const handler = context.getHandler();
        const classRef = context.getClass();

        const roles = Reflect.getMetadata('roles', handler) || Reflect.getMetadata('roles', classRef) || [];
        

        return roles
    }
}
