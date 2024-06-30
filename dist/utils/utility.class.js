export class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
    }
}
export class ApiResponse {
    constructor(statusCode = 200, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}
//  Phaser3 => Document is difficult and most of the thing on google is of phaser2
//  kaboom js => kaplay
//  Excalibur js
