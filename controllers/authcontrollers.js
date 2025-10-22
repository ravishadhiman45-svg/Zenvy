const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/generateToken')
const {registerSchema} = require('../validators/userValidator')
const {loginSchema} = require('../validators/loginValidator')
module.exports.registerUser = async function(req,res){
    try{
        const {error,value} = registerSchema.validate(req.body);
        if(error){
            req.flash("error", error.details[0].message);
            return res.redirect("/");
        }
        const{fullname , email, password} = value;
        const user = await userModel.findOne({"email":email})
        if(user){
             req.flash("error","You already have an account please login")
             return res.redirect('/')
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
                         req.flash("success","user created")
                         return res.redirect('/shop')               
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
     req.flash("error", error.details[0].message);
     return res.redirect("/");  
    }
    const{email, password} = value;
    const user = await userModel.findOne({email:email})
    if(!user) {
        req.flash("error","Email or Passsword Incorrect")
        return res.redirect('/')
    }
    bcrypt.compare(password,user.password,(err,result)=>{
    if(err){
        req.flash("error",err.message)
        return res.redirect('/')
    }else{
        if(result){
            const token = generateToken(user);
            res.cookie("token",token)
            return res.redirect('/shop');
        }else{
            req.flash("error","Email or Passsword Incorrect")
            return res.redirect('/')
        }
    }
     })
}

module.exports.logoutUser = async function (req,res) {
     res.clearCookie('token');
     req.flash("success","User logout")
     return res.redirect('/')
}