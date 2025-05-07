import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService{
    login(){
        return 'I am signin';

    }

    signup(){
        return 'I am signup';
    }
}