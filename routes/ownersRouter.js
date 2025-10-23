const express = require('express')
const router = express.Router();
const ownerModel = require('../models/owner-model')
const productsRouter = require('./productsRouter');
if(process.env.NODE_ENV === "development"){
    router.post('/create',async(req,res)=>{
        const owners = await ownerModel.find();
        if (owners.length>0){
            return res.status(5000).send("You cannot make a owner account")
        }
        let{ fullname , email , password } = req.body;
        let ownerCreated = await ownerModel.create({
              fullname,
              email ,
              password ,
        })
        res.status(201).send(ownerCreated)
    })
}

router.get('/',async(req,res)=>{
    const owner = await ownerModel.find();
    if(owner.length>0){
        const ownerData = owner[0];
         res.render('ownerPage',{owner:ownerData})
    }
});
router.use('/product',productsRouter);

router.get('/admin',(req,res)=>{
    let error = req.flash("error")
    let success = req.flash("success")
    res.render('createproduct',{error,success})
}
);

module.exports = router;