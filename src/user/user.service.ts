import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { NewUserDto } from './dto/newUser.dto';
import { ResponseRegisterUser } from './dto/response-register-user.dto';
import * as bcrypt from 'bcrypt'
import { CredentialDto } from './dto/credential.dto';
import { ResponseLoginDto } from './dto/response-login.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) { }

 
    async userRegister(newUser: NewUserDto): Promise<ResponseRegisterUser> {
        try {
            const checkuser = await this.userModel.find({ email: newUser.email })

            if (!checkuser) {
                return {
                    success: false,
                    message: "L'email est déjà utilisé.",
                    user: null
                }
            } else {
                const user = await this.userModel.create({ ...newUser })
                user.password = await bcrypt.hash(newUser.password, 10);
                await user.save()


                return {
                    success: true,
                    message: "Inscription effectuée avec succès.",
                    user: user
                }
            }

        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite.",
                user: null
            }
        }
    }

    async login(credential: CredentialDto) : Promise<ResponseLoginDto> {

        try {
            const user = await this.userModel.findOne({ email: credential.email })

            if (!user) {
                return {
                    success: false,
                    message: "L'email n'existe pas.",
                    access_token: null
                }
            }else{ 
                const matchPassword = await bcrypt.compare(credential.password , user.password)

                if(!matchPassword){
                    return {
                        success: false,
                        message: "Le mot de passe est incorrecte.",
                        access_token: null
                    }
                }else{
                    const payload = {id : user._id , name : user.name , email : user.email , role : user.role}

                    return  {
                        success: false,
                        message: "Bienvenue dans SnackSwift.",
                        access_token : this.jwtService.sign(payload)
                    }
                }
                
            }
        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite.",
                access_token: null
            }
        }




    }



}
