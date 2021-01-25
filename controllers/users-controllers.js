const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const { createPlace } = require('./places-controllers');



const getUsers =async (req, res, next) => {

  let users;

  try{
   users =await User.find({},'-password');

  }catch(err){
    return next(new HttpError('Failed to load users',500));
  };




  res.json({ users: users.map(user=> user.toObject({ getters : true})) });
};

const signup =async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return next(HttpError('Invalid inputs passed, please check your data.', 422)) ;
  }
  const { name, email, password } = req.body;


  let existingUser;

 try{
  existingUser = await User.findOne({email: email});
 }catch(err){
  return next(new HttpError('Signing up failed, try again late.',500));
 }
  
 if(existingUser){
   return next (new HttpError('You have already an account.',422));
 }

 const createdUser = new User({
   name,
   email,
   image:req.file.path,
   password,
   places: []
 });

 try{
  await createdUser.save();
 }catch(err){
   const error = new HttpError(
     'Signing up Failed,please try again',422
   );
 }

  res.status(201).json({user: createdUser.toObject({ getters: true})});
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  

  let existingUser;

 try{
  existingUser = await User.findOne({email: email});
 }catch(err){
  return next(new HttpError(' Loging failed, try again late.',500));
 }
  
if(!existingUser || existingUser.password!== password){
  return next(new HttpError('Invalid cresentials,could not log you in.',401));
}

  res.json({message: 'Logged in!',user: existingUser.toObject({getters:true})});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
