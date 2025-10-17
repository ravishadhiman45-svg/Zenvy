const express = require('express')
const router = express.Router();
const ownerModel = require('../models/owner-model')
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

router.get('/',(req,res)=>{
    res.send('working Properly in owner router')
})
router.get('/admin',(req,res)=>{
    res.render('createproduct')
})

module.exports = router;