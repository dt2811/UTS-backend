const userrouter=require('express').Router();
const AuthMiddleWare=require('../Middlewares/Auth');
const UserController=require('../Controllers/User');

userrouter.post('/otp',UserController.requestOtp);
userrouter.post('/login-signup',UserController.verifyOtp);
userrouter.post('/register',UserController.registerNewUser);
userrouter.get('/get-booked',AuthMiddleWare,UserController.getAllBookedTickets);
userrouter.post('/book-ticket',AuthMiddleWare,UserController.bookTickets);
module.exports=userrouter;