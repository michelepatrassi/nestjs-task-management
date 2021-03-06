import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialsDto {
    @IsString() 
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString() 
    // @MinLength(4)
    // @MaxLength(20)
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak (required at least 1 uppercase letter, 1 lowercase, 1 number or special char)'})
    password: string;
}