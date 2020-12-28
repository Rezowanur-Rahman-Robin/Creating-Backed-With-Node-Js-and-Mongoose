//extends basically inhirate the methods and property of Error class inside HttpError class
class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Add a "message" property
    
    /*
    super(message) basically does:
    
    Error(message)

    create a contructor of the extended Error class 
    and pass message as a argument inside it.
    so now we have all the menthods and property of Error in HttpError class.


    ref link to learn more:https://www.w3schools.com/jsref/jsref_class_extends.asp
    */
    this.code = errorCode; // Adds a "code" property in HttpError
  }
}

module.exports = HttpError;