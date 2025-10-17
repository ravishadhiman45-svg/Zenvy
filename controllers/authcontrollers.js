const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/generateToken')
const {registerSchema} = require('../validators/userValidator')
const {loginSchema} = require('../validators/loginValidator')
module.exports.registerUser = async function(req,res){
    try{
        const {error,value} = registerSchema.validate(req.body);
        if(error){
            return res.status(400).json({ error: error.details[0].message });
        }
        const{fullname , email, password} = value;
        const user = await userModel.findOne({"email":email})
        if(user){
            return res.status(201).send("You already have an account please login")
        }
        bcrypt.genSalt(10,function(err,salt){
            if(err){
                res.send(err.message)
            }else{
                bcrypt.hash(password,salt,async function(err,hash){
                    if(err){
                        res.send(err.message)
                    }else{
                         const userCreated = await userModel.create({
                        fullname,
                        email,
                        password :hash,
                         })
                         const token = generateToken(userCreated)
                         res.cookie("token",token)
                         res.send("user created succesfully")                
                    }
                })
            }
        })

    }catch(err){
        res.send(err.message)
    }
}

module.exports.loginUser = async function(req,res){
    const {error,value} = loginSchema.validate(req.body);
    if(error){
      return res.status(400).json({ error: error.details[0].message })  
    }
    const{email, password} = value;
    const user = await userModel.findOne({email:email})
    console.log("User found:", user);
    if(!user) return res.status(404).send("Email or Passsword Incorrect")
        console.log("Plain password:", password);
        console.log("Hashed password from DB:", user.password);
    bcrypt.compare(password,user.password,(err,result)=>{
    if(err){
        res.send(err.message)
    }else{
        if(result){
            const token = generateToken(user);
            res.cookie("token",token);
            res.send("you logged in succesfully in your account")
        }else{
            res.status(404).send("Email or Passsword Incorrect")
        }
    }
     })
}