
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv'
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';

dotenv.config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET,
        });
    }

    async validate(payload) {

        try {
            const user = await this.userModel.findOne({ email: payload.email })

            if (!user) {
                throw new Error("Utilisateur non trouvé");
            } else {
                delete user.password
                return {
                    success: true,
                    message: "Bienvenue",
                    user
                }
            }


        } catch (error) {
            return {
                success: false,
                message: "Une erreur s'est produite",
                user: null
            }
        }

    }
}
