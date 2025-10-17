const express = require('express')
const { registerUser ,loginUser, logoutUser } = require('../controllers/authcontrollers')
const router = express.Router()
router.get('/',(req,res)=>{
    res.send("its working")
})
router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/logout',logoutUser)
module.exports = router