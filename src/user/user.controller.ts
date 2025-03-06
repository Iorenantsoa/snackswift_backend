import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NewUserDto } from './dto/newUser.dto';
import { UserService } from './user.service';
import { ResponseRegisterUser } from './dto/response-register-user.dto';
import { CredentialDto } from './dto/credential.dto';
import { ResponseLoginDto } from './dto/response-login.dto'; 
import { JwtAuthGuard } from './guard/jwt-aut.guard';

@Controller('authentication')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post('/register')
    @UseGuards(JwtAuthGuard)
    async register(
        @Body() newUser: NewUserDto
    ): Promise<ResponseRegisterUser> {
        return this.userService.userRegister(newUser)
    }

    @Post('/login')
    async login(
        @Body() credential: CredentialDto
    ): Promise<ResponseLoginDto> {
        return this.userService.login(credential)
    }

}
