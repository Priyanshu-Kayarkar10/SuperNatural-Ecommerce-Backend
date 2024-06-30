export class ErrorHandler extends Error{

    constructor(public message: string,public statusCode: number){
        super(message);
        this.statusCode = statusCode;

    }
}

export class ApiResponse<T> {
    statusCode?: number;
    data?: T;
    message?: string;

    constructor(statusCode: number = 200, data: T, message: string = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}





//  Phaser3 => Document is difficult and most of the thing on google is of phaser2
//  kaboom js => kaplay
//  Excalibur js