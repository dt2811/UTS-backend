var jwt = require('jsonwebtoken');
const sendOtp = require('../Utils/OTP');
const bcrypt = require('bcrypt');
const Users = require('../Models/User');
const Stations = require('../Models/Station');
const Ticket = require('../Models/Tickets');
require('dotenv').config();
class UserController {

    generateToken(PhoneNumber) { // GENERATE JWT TOKEN
        return jwt.sign({ PhoneNumber }, process.env.JWT_KEY, {
            expiresIn: '7d',
        });
    }

    async verifyOtp(req, res) {  // OTP VERIFY CODE
        try {
            let PhoneNumber = req.body.PhoneNumber;
            let otp = req.body.OTP;
            const regex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
            if (PhoneNumber && otp) {
                if (regex.test(PhoneNumber) == true) {
                    var isvalidOTP = bcrypt.compareSync(otp.toString(), req.cookies[PhoneNumber.toString()]) // COMPARING THE HASHED OTP WITH THE OTP SENT BY UER

                    if (isvalidOTP) {
                        var result = await Users.findOne({ PhoneNumber: PhoneNumber }); // FINDING IF THE USER IS THERE IN THE DB OR NOT

                        if (result) {
                            var token = new UserController().generateToken(PhoneNumber); // GENERATING AUTH TOKEN FOR FURTHER OTP VERIFICATION
                            res.status(200).send({ message: 'OTP verified', data: result, token: token });
                        }
                        else {
                            res.status(400).send({ error: 'User not regsitered' });
                        }
                    }

                    else {
                        res.status(400).send({ error: 'Please send valid OTP' });
                    }
                    return;
                }


                else {
                    res.status(400).send({ error: 'Please send valid PhoneNumber' });
                    return;
                }

            }
            res.status(400).send({ error: 'Please send valid OTP and PhoneNumber' });
            return;
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }

    async registerNewUser(req, res) {  // REGISTER NEW USER
        try {
            var name = req.body.Name;
            var email = req.body.Email;
            var PhoneNumber = req.body.PhoneNumber;
            const PhoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
            const EmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (name && email && PhoneNumber) {
                if (name.length <= 0) {
                    res.status(400).send({ error: 'Send valid details' });
                }
                else if (EmailRegex.test(email) == false) {

                    res.status(400).send({ error: 'Send valid details' });
                }
                else if (PhoneRegex.test(PhoneNumber) == false) {

                    res.status(400).send({ error: 'Send valid details' });
                }
                else {
                    var result = await Users.findOne({ PhoneNumber: PhoneNumber }); // CHECKING IF THE USER IS THERE OR NOT
                    if (result) {
                        res.status(400).send({ error: 'User already registered' });
                    }
                    else {
                        const user = new Users({
                            Name: name,
                            Email: email,
                            PhoneNumber: PhoneNumber,
                            bookedTickets: [],
                        });
                        result = await user.save(); // ADDING USER AFTER VALIDATIONS
                        if (result) {
                            res.status(200).send({ message: 'User registered succesfully', data: result });
                            return;
                        }
                        else {
                            res.status(400).send({ error: 'User already registered' });
                        }
                    }
                }
            }
        }
        catch (error) {
            console.log(error)
            res.status(400).send({ error: 'Error occured at backend!!' });
        }
    }


    requestOtp(req, res) {  // SEND OTP AFTER VERIFYINH
        let PhoneNumber = req.body.PhoneNumber;
        const regex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
        if (PhoneNumber) {
            if (regex.test(PhoneNumber) == true) {
                var otp = Math.floor(1000 + Math.random() * 9000).toString();
                var isOTPSent = true//sendOtp( PhoneNumber, otp);  // OTP FUNCTION
                if (isOTPSent) {
                    var hash = bcrypt.hashSync(otp, 10); // HASHING THE OTP 

                    let options = {
                        maxAge: 1000 * 60 * 5, // would expire after 5 minutes
                        httpOnly: true, // The cookie only accessible by the web server
                        // Indicates if the cookie should be signed
                    }
                    res.clearCookie(PhoneNumber.toString()); 
                    res.cookie(PhoneNumber.toString(), hash, options) // ADDING THE OTP IN COOKIE FOR T MINUTES
                    console.log(otp);
                    res.status(200).send({ message: 'OTP sent sucessfully !!' })
                    return;
                }
                else {
                    res.status(400).send({ error: 'Could not send OTP error occured!!' });
                    return;
                }
            }
            res.status(400).send({ error: 'Please send valid PhoneNumber' });
            return;
        }
        res.status(400).send({ error: 'Could not read !!Please send valid PhoneNumber' });
    }


    async getAllBookedTickets(req, res) {  // GET ALL BOOKED TICKETS FOR THE USER
        try {

            var userInfo = req.body.user;
            var data = await Ticket.find({ _id: userInfo["BookedTickets"] }); // GET THE BOOKED TICKETS DETAILS
            if (data) {
                var station1=[];
                var station2=[]
                data.forEach((ticket)=>{
                    station1.push(ticket['Station1Id']);
                    station2.push(ticket['Station2Id']);
                })
                var station1Details=await Stations.find({_id:station1}); // GETTING STATION DETAILS
                var station2Details=await Stations.find({_id:station2});
                var tempData=[];
                if(station1Details && station2Details){
                    station1Details.forEach((station1,index)=>{ // ADDING STATION DETAILS TO THE OBJECT
                         var tempObj=Object.assign({},data[index]['_doc']);
                          var tempstation1=Object.assign({},station1['_doc']);
                          var tempstation2=Object.assign({},station2Details[index]['_doc'])
                          delete tempstation1['_id'];
                          delete tempstation1['updatedAt'];
                          delete tempstation1['createdAt'];
                          delete tempstation2['_id'];
                          delete tempstation2['updatedAt'];
                          delete tempstation2['createdAt'];
                          delete tempObj['Station1Id'];
                          delete tempObj['Station2Id'];
                          delete tempObj['_id'];
                          delete tempObj['PhoneNumber'];
                          delete tempObj['updatedAt'];
                          tempObj['Station1']=tempstation1;
                          tempObj['Station2']=tempstation2;
                          
                          tempData.push(tempObj);
                    });

                    res.status(200).send({ data: tempData });
                    return;
                }
                else{
                    res.status(400).send({ error: 'Error occured !!' });
                    return;
                }
               
            }
            else {
                res.status(400).send({ error: 'Error occured !!' });
            }
        }
        catch (error) {
            console.log(error);
            res.status(400).send({ error: 'Error occured at backend !!' });
        }
    }
    
    async bookTickets(req, res) { // BOOK TICKETS
        
        var PhoneNumber = req.body.user.PhoneNumber;
        var Station1Id = req.body.Station1Id;
        var Station2Id = req.body.Station2Id;
        var Class = req.body.Class;
        var JourneyType = req.body.JourneyType;
        var NumberOfAdults = req.body.NumberOfAdults;
        var NumberOfChildren = req.body.NumberOfChildren;
        var PaymentID = req.body.PaymentID;
        var userInfo = req.body.user;
        try {
          
            if (PhoneNumber !==undefined && Station1Id !==undefined && Station2Id !==undefined && Class !==undefined && JourneyType !==undefined && NumberOfAdults !==undefined&& NumberOfChildren !==undefined && PaymentID !==undefined) { 
                var station1 = true //await Stations.findById([Station1Id, Station2Id]);
                //var station2 = await Stations.findById(Station2Id);
                if (station1) {
                    var ticket = new Ticket({
                        PhoneNumber: PhoneNumber,
                        Station1Id: Station1Id,
                        Station2Id: Station2Id,
                        Class: Class,
                        JourneyType: JourneyType,
                        NumberOfAdults: NumberOfAdults,
                        NumberOfChildren: NumberOfChildren,
                        PaymentID: PaymentID,
                    });
                   var result = await ticket.save(); // SAVE TICKETS TO DATABASE
                    if (result) {
                        
                      
                        var tempArray = Array.from(userInfo. BookedTickets);
                        tempArray.push(result._id);
                        userInfo.BookedTickets = tempArray;
                        result = await Users.updateOne({ PhoneNumber: PhoneNumber }, { BookedTickets: userInfo.BookedTickets }); // SAVE THE TICKET IDS TO THE DATABASE
                                
                        res.status(200).send({ message: 'Ticket booked' });
                        return;
                    }
                    else {
                        res.status(400).send({ error: 'Ticket could not be booked' });
                        return;
                    }
                }
                else {
                    res.status(400).send({ error: 'Could not find Stations!!' });
                }
            }

            else {
                res.status(400).send({ error: 'Send proper Things' });

            }
        }
        catch (error) {
            console.log(error);
            res.status(400).send({ error: 'error occured at backend' });

        }
    }
}
module.exports = new UserController();