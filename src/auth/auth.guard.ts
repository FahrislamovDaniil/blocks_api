import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

/**
 * Guard для проверки JWT авторизации пользователя, совершившего запрос
 */
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private userService: UserService) {}

    /**
     * Реализация функции из интерфейса CanActivate, разрешающая или запрещающая выполнение запроса
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            if (bearer != 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'User is unauthorized' });
            }

            const user = await this.userService.getById(this.jwtService.verify(token).id);
            req.user = user;
            return true;
        } catch(e) {
            throw new UnauthorizedException({ message: 'User is unauthorized' });
        }
    }
}