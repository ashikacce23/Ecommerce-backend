
//code gula inharit er maddhome short korbo.
class ErrorHandler extends Error{
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = ErrorHandler;
//er por middleware banate hobe."utils"=>"error.js"
//sekhne eita import korte hobe.






