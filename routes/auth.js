const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const nodemailer =require('nodemailer');

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).json({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).json({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).json({ message: "Invalid Email or Password" });

		const token = user.generateAuthToken();
		res.status(200).json({ data: token, message: "logged in successfully" });
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

//forgot password
router.post('/forgotpassword',async(req,res)=>{
	const {email} =req.body;
  const user = await User.findOne({ email });


  if (!user) {
    return res.status(401).json({ message: "user not exits" });
  }
  const token = jwt.sign({id:user._id},process.env.JWTPRIVATEKEY,{expiresIn:"1h"});


  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });
  
  var mailOptions = {
    from: 'noorulshihabudeen@gmail.com',
    to: req.body.email,
    subject: 'Reset your password',
    text: `http://localhost:5173/resetpassword/${user._id}/${token}`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      res.send({ code: 200, message: 'success' })
    }
  });

});
///resetpassword
router.post('/resetpassword/:id/:token',async(req,res)=>{
	console.log(req.body)
    const{id,token} =req.params;
    const { password } = req.body;

    const hashedPassword =await  bcrypt.hash(password,10);
   jwt.verify(token, process.env.JWTPRIVATEKEY, (err,decoded)=>{
     console.log(hashedPassword)
      if(err){
        return res.json({status:"Error with token"})
      }
      
       
          
        User.findByIdAndUpdate({_id:id} , { password: hashedPassword })
            .then(result => {
                res.send({ code: 200, message: 'Password updated' })
            })
            .catch(err => {
                res.send({ code: 500, message: 'Server err' })

            })

         
    });
  
});

module.exports = router;