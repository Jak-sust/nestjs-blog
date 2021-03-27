import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { of, from, Observable } from 'rxjs';
import { User } from 'src/user/models/user.inferface';
const bcrypt = require('bcrypt'); 

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService){}

    generateJWT(user: User): Observable<string> {
        return from(this.jwtService.signAsync({user}));
    }

    hashPassword(password: string): Observable<string>{
        return from<string>(bcrypt.hash(password, 12));
    }

    comparePassword(newPassword: string, passwordHash: string): Observable<any>{
        return from<any>(bcrypt.compare(newPassword, passwordHash));
        //const compare =  bcrypt.compare(newPassword, passwordHash);
        // if(compare){
        //     return from<boolean>(true);
        // }else{
        //     return false;
        // }
    }

}
