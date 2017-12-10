/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START app]
const express = require('express');

const app = express();



var bodyParser     =         require("body-parser");
var connect = require('connect');
var mongoose       =         require('mongoose');
var fs = require('fs');


const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: "bac0dc05",
  apiSecret: "849ea4a9f5790a21"
});



var nodemailer = require("nodemailer");
mongoose.connect('mongodb://vinitraj:vin@ds127854.mlab.com:27854/pipiride');
//mongoose.connect('mongodb://localhost/OfferApp');
// Configuration
app.use(express.static(__dirname + '/uploads'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(connect.cookieParser());
app.use(connect.logger('dev'));
app.use(connect.bodyParser());

app.use(connect.json());  
app.use(connect.urlencoded());

// Routes

//require('./routes/routes.js')(app);

app.use(bodyParser.urlencoded({ extended: false }));

var stripe = require('stripe')('sk_test_1X9mLrQML4Vcq9KlqsDi6Iix'); //paste your test secret here
var cors = require('cors');
app.use(cors());

var ShopUser = new mongoose.Schema({
  business_name: {type: String,default:'no-value'},
  business_type: {type: String,default:'no-value'},
  building_name: {type: String,default:'no-value'},
  sub_area: {type: String,default:'no-value'},
  area: {type: String,default:'no-value'},
  city: {type: String,default:'no-value'},
  state: {type: String,default:'no-value'},
  country: {type: String,default:'no-value'},
  pincode: {type: String,default:'no-value'},
  mobileno: {type: String,default:'no-value'},
  password: {type: String,default:'no-value'},
  email: {type: String,default:'no-value'},
  paymentOptions: { type: Array, default: [] },
  latitude: {type: String,default:'no-value'},
  longitude: {type: String,default:'no-value'}
});

var Offer = new mongoose.Schema({
  business_name: {type: String,default:'no-value'},
  business_type: {type: String,default:'no-value'},
  mobile_no: {type: String,default:'no-value'},
  product_name: {type: String,default:'no-value'},
  offer_name: {type: String,default:'no-value'},
  startdate: {type: String,default:'no-value'},
  enddate: {type: String,default:'no-value'},
  period: {type: String,default:'no-value'},
  amount_paid:{type: String,default:'no-value'},
  latitude: {type: String,default:'no-value'},
  longitude: {type: String,default:'no-value'},
  building_name: {type: String,default:'no-value'},
  sub_area: {type: String,default:'no-value'},
  area: {type: String,default:'no-value'},
  city: {type: String,default:'no-value'},
  state: {type: String,default:'no-value'},
  country: {type: String,default:'no-value'},
  pincode: {type: String,default:'no-value'},
  paymentOptions: { type: Array, default: [] },
});

var AddBike = new mongoose.Schema({
  bikeName      : String,
  bikeImageName : String,
  fuelType      : String,
  seat          : String,
  priceSixHour  : String,
  kmLimitSixHour: String,
  areaName      : String,
  location      : String,
  bikeRegNo: String,
  bikeRegYear: String,
  bikeColor: String,
  vechilePriceBooked:String,
  vechleStartDate:String,
  vechileStartTime:String,
  vechileEndDate:String,
  vechileEndTime:String,
  vechileRegNo:String,
  vechileBookedByPhoneNo:String
});

var Venue = new mongoose.Schema({
  areaName: String,
  location: String
});

var Coupon = new mongoose.Schema({
  couponCode: String
});

var ShopUser = mongoose.model('shop_user', ShopUser);

var Offer = mongoose.model('offer', Offer);

var AddBike = mongoose.model('add_bike', AddBike);

var Venue = mongoose.model('venue', Venue);

var Coupon = mongoose.model('coupon', Coupon);

app.get('/',function(req,res){
  res.sendFile(__dirname +'/index.html');
  //res.sendStatus(404);
});

var smtpTransport = nodemailer.createTransport("SMTP",{
service: "Gmail",
auth: {
user: "vinitraj96@gmail.com",
pass: "sugun.bintu.123&"
}
});

///////////////////////////////////////////////////// Registration and Login Routes Starts /////////////////////////////////////////////

app.post('/upload', function(req, res) {
  var phoneNo=req.body.phoneNo;
  console.log(req.files.image.originalFilename);
  console.log(req.files.image.path);
    fs.readFile(req.files.image.path, function (err, data){
    var dirname = "/home/ubuntu/newproject";
    var newPath = dirname + "/uploads/" +   req.files.image.originalFilename;
    fs.writeFile(newPath, data, function (err) {
    if(err){
    res.json({'response':"Error"});
    }else {
	  user.find({ mobileNo: phoneNo },
	  function(err,doc) {
	      if (err) throw err;

	      else{
	      if(doc.length===0){
		console.log('invalid user');
		res.json({"msg":"not sucess"});
	      }
	      if(doc.length===1){
		user.update({mobileNo:phoneNo},
			{
			  $set: {
			   drivingLicence:"saved"
			  }
			},function(err,doc){
			  if(err){
			    console.log('error');
			  }else{
			      res.json({'response':"Saved"});
			  }
		});
	      }
	    }

	  });     
}
});
});
});

app.post('/processpay',function(req,res){
  console.log("processpay");
  console.log(req.body.amount);
  console.log(req.body.product_name);
  console.log(req.body.offer_name);
  console.log(req.body.start_date);
  console.log(req.body.end_date);

  var mobile_no = req.body.mobile_email;
  var product_name =req.body.product_name;
  var offer_name = req.body.offer_name;
  var startdate = req.body.start_date;
  var enddate = req.body.end_date;
  var period = req.body.period;
  var amount_paid = req.body.amount;

  var business_name = req.body.business_name;
  var business_type = req.body.business_type;
  var building_name = req.body.building_name;
  var sub_area = req.body.sub_area;
  var area = req.body.area;
  var city = req.body.city;
  var state = req.body.state;
  var country = req.body.country;
  var pincode = req.body.pincode;
  var paymentOptionsOpted = req.body.paymentOptionsOpted;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;

  console.log(business_name);
  console.log(business_type);
  console.log(building_name);
  console.log(sub_area);
  console.log(area);
  console.log(city);
  console.log(state);
  console.log(country);
  console.log(pincode);
  console.log(paymentOptionsOpted);
  console.log(latitude);
  console.log(longitude);

 
  // var stripetoken = req.body.stripetoken;
  // var typeObject = stripetoken.type;
  // var cardObject= stripetoken.card;
  
  // cardObject.object = typeObject;
  // console.log("cardObject ");
  // console.log(cardObject);
  
  // var idObject = stripetoken.id;
  // var createdObject = stripetoken.created;
  
  // var stripetokenNew={};
  // stripetokenNew.card=cardObject;
  // stripetokenNew.id=idObject;
  // stripetokenNew.type=typeObject;
  // stripetokenNew.created=createdObject;
  // stripetokenNew.object=typeObject;

  //  console.log("stripetokenNew >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ");
  //  console.log(stripetokenNew);
  //   var amountpayable = req.body.amount;
    // var charge = stripe.charge.create({
    //     amount: amountpayable,
    //     currency: 'usd',
    //     description: 'Sample transaction',
    //     source: stripetoken
    // }, function (err, charge) {
    //     if (err)
    //         console.log(err);
    //     else
    //         res.send({ success: true });
    // });
    // var stripetoken = req.body.stripetoken;
    // var amountpayable = req.body.amount;
    //  var charge = stripe.charge.create({
    //     amount: amountpayable,
    //     currency: 'usd',
    //     description: 'Sample transaction',
    //     source: stripetoken
    // }, function (err, charge) {
    //     if (err)
    //         console.log(err);
    //     else
    //         res.send({ success: true });
    // })
    
    // stripe.customers.create({
    //   email: 'vinitraj96@gmail.com',
    //   card: req.body.stripetoken
    // })
    // .then(customer =>
    //   stripe.charges.create({
    //     amountpayable,
    //     description: "Sample Charge",
    //     currency: "usd",
    //     customer: 'vinitraj96'
    //   }))
    // .catch(err => res.send({ success: false }))
    // .then(charge => res.json({ success: true }));

    // stripe.customers.create({
    //     email: "vinitraj96@gmail.com", // customer email, which user need to enter while making payment
    //     source: stripetokenNew // token for the given card 
    // })
    // .then(customer =>
    //     stripe.charges.create({ // charge the customer
    //     amountpayable,
    //     description: "Sample Charge",
    //         currency: "usd",
    //         customer: "1"
    //     }))
    // .then(charge => res.json({success:true}));


    Offer.find({$and:[{product_name:product_name}]},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
        console.log('Adding new user');
        new Offer({
            mobile_no: mobile_no,
            product_name: product_name,
            offer_name: req.body.offer_name_info,
            startdate: startdate,
            enddate: enddate,
            period: period,
            amount_paid: amount_paid,
            business_name: business_name,
            business_type: business_type,
            building_name: building_name,
            sub_area: sub_area,
            area: area,
            city: city,
            state: state,
            country: country,
            pincode: pincode,
            paymentOptionsOpted: paymentOptionsOpted,
            latitude: latitude,
            longitude: longitude

        }).save(function(err, doc){
          if(err) console.log('error');
          else{
            //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
            res.json({"success":true});
          }
        });
      }else{
        res.json({"success":false});
      }
    }
  });
});

app.post('/fetchOffer',function(req,res){
  console.log("fetchOffer >>>>>>>>>>>>>>>> ");
  var mobile_email = req.body.mobile_email;
  console.log(mobile_email);
  Offer.find({"mobile_no":mobile_email},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length==0){
        res.json({"success":false});
      }else{
        console.log("fetch offer doc");
        console.log(doc);
        res.json({"success":true,"doc":doc});
      }
    }
  });
});

app.post('/fetchAllOffer',function(req,res){
  console.log("fetchOffer >>>>>>>>>>>>>>>> ");
  Offer.find({},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length==0){
        res.json({"success":false});
      }else{
        console.log("fetch offer doc");
        console.log(doc);
        res.json({"success":true,"doc":doc});
      }
    }
  });
});

app.post('/login',function(req,res){
  console.log('login')
  console.log(req.body.mobile_email);
  console.log(req.body.password);
  var mobile_email = req.body.mobile_email;
  var password = req.body.password;
  ShopUser.find({$and:[{mobileno:mobile_email},{password:password}]},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length>0){
        console.log("mobile true");
        console.log(doc);
        res.json({"success":true,"doc":doc});
      }else{
        ShopUser.find({$and:[{email:mobile_email},{password:password}]},function(err,doc1){
          if(err){
            console.log('error');
          }else{
            if(doc1.length>0){
              console.log("email true");
              res.json({"success":true,"doc":doc1});
            }else{
              console.log("both false");
              res.json({"success":false});
            }
          }
        });
      }
    }
  });
});

app.post('/register',function(req,res){
  console.log("register");
  var business_name = req.body.business_name;
  var business_type = req.body.business_type;
  var building_name = req.body.building_name;
  var sub_area = req.body.sub_area;
  var area = req.body.area;
  var city = req.body.city;
  var state = req.body.state;
  var country = req.body.country;
  var pincode = req.body.pincode;
  var mobileno = req.body.mobileno;
  var password = req.body.password;
  var email = req.body.email;
  var paymentOptionsOpted = req.body.paymentOptionsOpted;
  var latitude = req.body.lat_long.latitude;
  var longitude = req.body.lat_long.longitude;
 /*nexmo.message.sendSms(
  '919035713685', '917618731317', otp.toString(),
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
      }
    }
 );*/
  ShopUser.find({$and:[{mobileno:mobileno,email:email}]},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
        console.log('Adding new user');
        new ShopUser({
          business_name : business_name,
          business_type : business_type,
          building_name : building_name,
          sub_area : sub_area,
          area : area,
          city : city,
          state : state,
          country : country,
          pincode : pincode,
          mobileno : mobileno,
          password : password,
          email : email,
          paymentOptions : paymentOptionsOpted,
          latitude : latitude,
          longitude : longitude
        }).save(function(err, doc){
          if(err) console.log('error');
          else{
            //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
            res.json({"success":true});
          }
        });
      }else{
        res.json({"success":false});
      }
    }
  });

});

app.post('/matchOtp',function(req,res){
  console.log("register");
  var mobileNo=req.body.mobileNo;
  var otp = req.body.otp;
  
  user.find({$and:[{mobileNo:mobileNo,otp:otp}]},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
         res.json({"doc":"not valid"});
      }else{
        user.update({mobileNo:mobileNo},
        {
          $set: {
           otp : ''
          }
        },function(err,doc){
          if(err){
            console.log('error');
          }else{
             res.json({"doc":"valid"});
          }
        });
      }
    }
  });

});

app.post('/deleteOtp',function(req,res){
  console.log("deleteOtp");
  var mobileNo=req.body.mobileNo;
  setTimeout(myFunc, 5 * 60 * 1000,mobileNo,res);          
});

function myFunc(arg,res) {
  user.update({mobileNo:arg},
    {
      $set: {
       otp : ''
      }
    },function(err,doc){
      if(err){
        console.log('error');
      }else{
      }
    });
}

app.post('/CompletePayment',function(req,res){
  console.log("add coupon .....................................");
  var mobileNo=req.body.phoneNo;
	var vechileNameBooked=req.body.bikeName;
	var vechileAreaBooked=req.body.areaName;
	var vechilePriceBooked=req.body.bikePrice;
	var vechleStartDate=req.body.startdate;
	var vechileStartTime=req.body.starttime;
	var vechileEndDate=req.body.enddate;
	var vechileEndTime=req.body.endtime;
	var vechileLocationBooked=req.body.location;
	  user.find({'mobileNo': mobileNo } ,function(err,data){
	    if(err){

	    }else{
	      if(data.length==0){
	      }else{
		user.update({mobileNo:mobileNo},
		{
		  $set: {
		   vechileNameBooked : vechileNameBooked,
			  vechileAreaBooked : vechileAreaBooked,
			  vechileLocationBooked : vechileLocationBooked,
			  vechilePriceBooked : vechilePriceBooked,
			  vechleStartDate : vechleStartDate,
			  vechileStartTime : vechileStartTime,
			  vechileEndDate : vechileEndDate,
			  vechileEndTime : vechileEndTime
		  }
		},function(err,doc){
		  if(err){
		    console.log('error');
		  }else{
		    //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);

		    //res.json({"doc":"valid","otp":"otp: "+otp.toString()});
		  	AddBike.update( { 'bikeName': vechileNameBooked },
			{
			  $set: {
				  
			   	  vechilePriceBooked : vechilePriceBooked,
				  vechleStartDate : vechleStartDate,
				  vechileStartTime : vechileStartTime,
				  vechileEndDate : vechileEndDate,
				  vechileEndTime : vechileEndTime,
				  vechileBookedByPhoneNo:mobileNo
			  }
			},function(err,doc){
			  if(err){
			    console.log('error');
			  }else{
			    //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);

			    res.json({"doc":"booked"});
			  }
			});
		  }
		});
	      }
	    }
	  });
});

app.post('/AddCoupon',function(req,res){
  console.log("add coupon .....................................");
  var couponCode=req.body.couponCode;
  Coupon.find({'couponCode': couponCode } ,function(err,data){
    if(err){

    }else{
      if(data.length==0){
	new Coupon({
	  couponCode : couponCode
	}).save(function(err, doc){
	  if(err) console.log('error');
	  else{
	    res.json({"doc":"successfully added"});
	  }
	});
      }else{
	res.json({"doc":"already added"});
      }
    }
  });
});

app.post('/SearchCoupon',function(req,res){
  console.log("search coupon .....................................");
  var couponCode=req.body.couponCode;
  Coupon.find({'couponCode': couponCode } ,function(err,data){
    if(err){

    }else{
      if(data.length==0){
	
	res.json({"doc":"no such coupon"});
      }else{
	res.json({"doc":"successfully added"});
      }
    }
  });
});

app.post('/AddVenue',function(req,res){
  console.log("add venue .....................................");
  var areaName=req.body.areaName;
  var location=req.body.location;
  Venue.find({ $and: [ {'areaName': areaName }, { 'location': location } ] },function(err,data){
    if(err){

    }else{
      if(data.length==0){
	new Venue({
	  areaName : areaName,
	  location : location
	}).save(function(err, doc){
	  if(err) console.log('error');
	  else{
	    res.json({"doc":"successfully added"});
	  }
	});
      }else{
	res.json({"doc":"already added"});
      }
    }
  });
});

app.post('/AddBike',function(req,res){
  console.log("add bike.....................................");
  var bikeRegNo=req.body.bikeRegNo;
  var bikeRegYear=req.body.Year;
  var bikeColor=req.body.bikeColor;
  var bikeName=req.body.bikeName;
  var bikeImageName= req.body.bikeImageName;
  var fuelType= req.body.fuelType;
  var seat=req.body.seat;
  var priceSixHour= req.body.priceSixHour;
  var kmLimitSixHour= req.body.kmLimitSixHour;
  var areaName= req.body.areaName;
  var location= req.body.locationName;
  AddBike.find({ $and: [ {'bikeName': bikeName }, { 'bikeRegNo': bikeRegNo } ] },function(err,data){
    if(err){

    }else{
      if(data.length==0){
	new AddBike({
	  bikeName : bikeName,
	  bikeRegNo: bikeRegNo,
	  bikeRegYear: bikeRegYear,
	  bikeColor: bikeColor,
          bikeImageName : bikeImageName,
          fuelType : fuelType,
          seat : seat,
          priceSixHour : priceSixHour,
          kmLimitSixHour : kmLimitSixHour,
          areaName : areaName,
	  location : location,
	  vechilePriceBooked : '',
	  vechleStartDate : '',
	  vechileStartTime : '',
	  vechileEndDate : '',
	  vechileEndTime : '',
          vechileBookedByPhoneNo:''
	}).save(function(err, doc){
	  if(err) console.log('error');
	  else{
	    res.json({"doc":"successfully added"});
	  }
	});
      }else{
	res.json({"doc":"already added"});
      }
    }
  });
});


app.post('/FetchUserAndBike',function(req,res){
  var phoneNo=req.body.phoneNo;
  AddBike.find({ vechileBookedByPhoneNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
        console.log('invalid user');
        res.json({"msg":"invalid"});
      }
      if(doc.length===1){
        console.log(doc);
        res.json({"doc":doc});
        //res.json({"doc":doc})
      }
    }
        
  });

});
app.post('/FetchAccount',function(req,res){
  var phoneNo=req.body.phoneNo;
  user.find({ mobileNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
        console.log('invalid user');
        res.json({"msg":"invalid"});
      }
      if(doc.length===1){
        console.log(doc);
        res.json({"doc":doc});
        //res.json({"doc":doc})
      }
    }
        
  });

});

app.post('/UpdateName',function(req,res){
  var phoneNo=req.body.phoneNo;
  var username=req.body.username;
  user.find({ mobileNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
        console.log('invalid user');
        res.json({"msg":"not sucess"});
      }
      if(doc.length===1){
        user.update({mobileNo:phoneNo},
		{
		  $set: {
		   username : username
		  }
		},function(err,doc){
		  if(err){
		    console.log('error');
		  }else{
		    res.json({"doc":"sucess"});
		  }
	});
      }
    }
        
  });

});

app.post('/StartTrip',function(req,res){
  var phoneNo=req.body.phoneNo;
  var bikeName=req.body.bikeName;
  var bikeRegNo=req.body.bikeRegNo;
  var bikeDoc;
  user.find({ mobileNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
        console.log('invalid user');
        res.json({"msg":"not sucess"});
      }
      if(doc.length===1){
        user.update({mobileNo:phoneNo},
		{
		  $set: {
		   vechileRegNo:bikeRegNo
		  }
		},function(err,doc){
		  if(err){
		    console.log('error');
		  }else{
		    
			   AddBike.find({ vechileBookedByPhoneNo: phoneNo },
				  function(err,doc) {
				      if (err) throw err;

				      else{
				      if(doc.length===0){
					console.log('invalid user');
					res.json({"msg":"invalid"});
				      }
				      if(doc.length===1){
					      bikeDoc=doc;
					AddBike.update( { vechileBookedByPhoneNo: phoneNo },
						{
						  $set: {

							  vechilePriceBooked : '',
							  vechleStartDate : '',
							  vechileStartTime : '',
							  vechileEndDate : '',
							  vechileEndTime : '',
							  vechileBookedByPhoneNo:''
						  }
						},function(err,doc){
						  if(err){
						    console.log('error');
						  }else{
						    //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
							AddBike.update( {$and:[{bikeName:bikeName,bikeRegNo:bikeRegNo}]},
							{
							  $set: {

								  vechilePriceBooked : bikeDoc[0].vechilePriceBooked,
								  vechleStartDate :  bikeDoc[0].vechleStartDate,
								  vechileStartTime : bikeDoc[0].vechleStartDate,
								  vechileEndDate : bikeDoc[0].vechileEndDate,
								  vechileEndTime : bikeDoc[0].vechileEndTime,
								  vechileBookedByPhoneNo:phoneNo
							  }
							},function(err,doc){
							  if(err){
							    console.log('error');
							  }else{
								   res.json({"doc":"sucess"});
								  //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
							  }
							});

						   
						  }
					});					
					//res.json({"doc":doc})
				      }
				    }

				  });
		  }
	});
      }
    }
        
  });

});

app.post('/EndTrip',function(req,res){
  var phoneNo=req.body.phoneNo;
   AddBike.find({ vechileBookedByPhoneNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
	console.log('invalid user');
	res.json({"msg":"invalid"});
      }
      if(doc.length===1){
	      bikeDoc=doc;
        AddBike.update( { vechileBookedByPhoneNo: phoneNo },
	{
	  $set: {

		  vechilePriceBooked : '',
		  vechleStartDate :  '',
		  vechileStartTime : '',
		  vechileEndDate : '',
		  vechileEndTime : '',
		  vechileBookedByPhoneNo:''
	  }
	},function(err,doc){
	  if(err){
	    console.log('error');
	  }else{
		user.update({mobileNo:phoneNo},
		{
		  $set: {
		     	vechileNameBooked:'',
			vechileAreaBooked:'',
			vechileLocationBooked:'',
			vechilePriceBooked:'',
			vechleStartDate:'',
			vechileStartTime:'',
			vechileEndDate:'',
			vechileEndTime:'',
			vechileRegNo:''
		  }
		},function(err,doc){
		  if(err){
		    console.log('error');
		  }else{
			res.json({"doc":"sucess"});
		  }
		 });
		  
		  //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
	  }
	});
      }
    }
        
  });

});

app.post('/UpdateEmail',function(req,res){
  var phoneNo=req.body.phoneNo;
  var email=req.body.email;
  user.find({ mobileNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
        console.log('invalid user');
        res.json({"msg":"not sucess"});
      }
      if(doc.length===1){
        user.update({mobileNo:phoneNo},
		{
		  $set: {
		   email : email
		  }
		},function(err,doc){
		  if(err){
		    console.log('error');
		  }else{
		    res.json({"doc":"sucess"});
		  }
	});
      }
    }
        
  });

});

app.post('/UpdateAddress',function(req,res){
  var phoneNo=req.body.phoneNo;
  var address=req.body.address;
  user.find({ mobileNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
        console.log('invalid user');
        res.json({"msg":"not sucess"});
      }
      if(doc.length===1){
        user.update({mobileNo:phoneNo},
		{
		  $set: {
		   address : address
		  }
		},function(err,doc){
		  if(err){
		    console.log('error');
		  }else{
		    res.json({"doc":"sucess"});
		  }
	});
      }
    }
        
  });

});

app.post('/FetchAllAddress',function(req,res){
  console.log("FetchAllAddress");
  var phoneNo=req.body.phoneNo;
  Venue.find({},function(err,data){
    if(err){

    }else{
	    user.find({mobileNo:phoneNo},function(err,doc){
	    	if(err){
		}else{
			console.log("doc >>>>>>>>>>>>>>>>>>>>>>>>> ");
			console.log(doc);
			if(doc[0].vechileNameBooked==''){
				 console.log(data);
        			res.json({"doc":data,"bookedStatus":"not booked"});	
			}else{
				res.json({"doc":data,"bookedStatus":"booked"});
			}
		}
	    });
       
      
    }
  });
});

app.post('/FetchAllBike',function(req,res){
  console.log("FetchAllBike");
  AddBike.find({},function(err,data){
    if(err){

    }else{
        console.log(data);
        res.json({"doc":data});
      
    }
  });
});

app.post('/saveAddress',function(req,res){
  console.log("saveAddress");
  var email=req.body.email;
  var phoneno=req.body.phoneno;
  var address=req.body.address;
  var pincode=req.body.pincode;
  var landmark=req.body.landmark;
  var city=req.body.city;
  var defaultAddress=req.body.defaultAddress;
  saveAddress.find({email:email},function(err, doc) {
      if(err){
        
      }else{
        if(doc.length===0){
            new saveAddress({
              email             : email,
              phoneno           : phoneno,
              address           : address,
              pincode           : pincode,
              landmark          : landmark,
              city              : city,
              defaultAddress    : "true"
            }).save(function(err, doc){
              if(err) console.log('error');
              else    res.json({"doc":doc});
            });
        }else{
          if(defaultAddress==="true"){
            saveAddress.update({email:email},
                {
                  $set: {
                   defaultAddress : "false"
                  }
                },{ multi: true },function(err,doc){
                  if(err){
                    console.log('error');
                  }else{
                    console.log('done');
                    new saveAddress({
                      email             : email,
                      phoneno           : phoneno,
                      address           : address,
                      pincode           : pincode,
                      landmark          : landmark,
                      city              : city,
                      defaultAddress    : defaultAddress
                    }).save(function(err, doc){
                      if(err) console.log('error');
                      else    res.json({"doc":doc});
                    });
                  }
            });
          }else{
            new saveAddress({
              email             : email,
              phoneno           : phoneno,
              address           : address,
              pincode           : pincode,
              landmark          : landmark,
              city              : city,
              defaultAddress    : defaultAddress
            }).save(function(err, doc){
              if(err) console.log('error');
              else    res.json({"doc":doc});
            });
          }
        }
      }
  });
});

app.post('/CompleteOrder',function(req,res){

  var email=req.body.email;
  var address=req.body.address;
  var orderId=req.body.orderId;
  var username=req.body.username;
  var deliverydate=req.body.deliverydate;
  var pickupdate=req.body.pickupdate;
  var datetime = new Date();

  console.log(datetime.getFullYear()+"   "+datetime);
  order.find({order_id:orderId},function(err,doc){
    if(err){

    }else{
      if(doc.length==0){
        new order({
            ordered_by_email      : email,
            address               : address,
            order_id              : orderId,
            ordered_on_date       : datetime.getDate()+"/"+(datetime.getMonth()+1)+"/"+datetime.getFullYear(),
            ordered_on_time       : datetime.getHours()+":"+datetime.getMinutes()+":"+datetime.getSeconds()
        }).save(function(err, doc){
          if(err) console.log('error');
          else    {
              var mailHtml1 = '<div style="border: 10px solid #03A9F4;float:left;padding: 1%;background: #F3F3F3">'+
                                          '<div>'+
                                              '<img style="height: 100px;width: 100px;float:right;" src="https://idealadda-vinitraj.c9users.io/uploads/idealaddalogo.png" alt="Ideal Adda">'+  
                                          '</div>'+            
                                          '<div style="text-align: justify;float:left;">'+
                                              '<p>Hi <b style="color:blue;">'+email+'</b></p>'+
                                              '<p>We have received your order '+orderId+' and it will be delivered to you within '+deliverydate+'.</p>'+
                                              '<p>Order Date:	'+datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear()+',Order Time:'+datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds()+'</p>'+
                                              '<p>Address:</p>'+
                                              '<p>'+address+'</p>';                        
                                      
              mailHtml1=mailHtml1+
                        '<p></p>'+
                        '<p>Thanks,</p>'+
                        '<p>Team Washing Adda.</p>'+
                        
                        '</div>'+
                        '</div>';
              var mailOptions={
                to : "vinitraj96@gmail.com,"+email,
                subject : "Your veegi order summary",
                text : "veggi",
                html: mailHtml1
              }
              console.log(mailOptions);
              smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                console.log(error);
                
                }else{
                }
              });
              res.json({"doc":"order completed"});
          }
        });
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
