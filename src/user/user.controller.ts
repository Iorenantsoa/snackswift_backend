import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { NewUserDto } from './dto/newUser.dto';
import { UserService } from './user.service';
import { ResponseRegisterUser } from './dto/response-register-user.dto';
import { CredentialDto } from './dto/credential.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { JwtAuthGuard } from './guard/jwt-aut.guard';
import { Roles } from 'decorators/roles.decorator';
import { RolesGuard } from 'guards/roles.guard';

@Controller('authentication')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post('/register')
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
    @Get('/get-user')
    async getUser(): Promise<ResponseRegisterUser> {
        return this.userService.getUser()
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch('role-modification/:id/:role')
    async modifyUserRole(
        @Param('id') userId: string,
        @Param('role') newRole: string
    ): Promise<ResponseRegisterUser> {
        return this.userService.modificationRole(userId, newRole);
    }


}


// {
//     "email" : "restaurant1@gmail.com",
//     "password":"restaurant1"
//   }


// {
//     "name": "restaurant2" ,
//     "email" : "restaurant2@gmail.com" ,
//     "password":  "restaurant2"
// }
//