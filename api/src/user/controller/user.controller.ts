import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../models/user.inferface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    @Post()
    create(@Body() user: User): Observable<User> {
        return this.userService.create(user);
    }

    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return this.userService.findOne(params.id);
    }

    @Get()
    find(): Observable<User[]> {
        return this.userService.findAll();
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<User> {
        return this.userService.deleteOne(Number(id));
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: any): Observable<any> {
        return this.userService.updateOne(Number(id), user);
    }
    

}
