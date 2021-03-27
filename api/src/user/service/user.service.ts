import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { stringify } from 'node:querystring';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/auth/service/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.inferface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly  userRepository: Repository<UserEntity>,
        private authService: AuthService
    ){}

    create(user: User): Observable<User>{
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string)=>{
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.email = user.email;
                newUser.username = user.username;
                newUser.password = passwordHash;

                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User)=>{
                        const {password, ...result} = user;
                        return result;
                    }),
                    catchError(err => throwError(err))
                );

            })
        );
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne(id)).pipe(
            map((user: User)=> {
                const { password, ...result } = user;
                return result;
            }),
            catchError(err => throwError(err))
        );
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[])=> {
                users.forEach(user=> delete user.password);
                return users;
            })
        );
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    updateOne(id: number, user: User): Observable<any> {
        delete user.email;
        delete user.password;

        return from(this.userRepository.update(id, user));
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: any)=>{
                //console.log('user: ');
                //console.log(user);
                if(user){
                    //return 'jakir hossain';
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                }else{
                    return new Observable<string>((observer:any) => {
                        observer.next('Email or Password is invalid');
                        observer.complete();
                    });
                }
            })
        );
    }

    validateUser(email: string, password: string): Observable<User|boolean> {
        return this.findByEmail(email).pipe(
            switchMap((user: User) => this.authService.comparePassword(password, user.password).pipe(
              map(match => {
                  console.log(match);
                  if(match){
                    const { password, ...result } = user;
                    return result;
                  }else{
                    //throw Error;
                    return false;
                    
                  }
              })  
            ))
        );
    }

    findByEmail(email: string): Observable<User> {
        return from(this.userRepository.findOne({email}));
    }

}
