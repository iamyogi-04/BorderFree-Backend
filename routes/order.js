const router= require('express').Router();
const Order = require('../models/Order');

router.get('/addprod', async(req, res)=>{
    try {
        const user = await Order.find();
        res.json(user)
        
    } catch (error) {
        console.log(error)
    }

})

router.post('/order',async(req, res)=>{

    try {
        const {title,price,category,description,image} = req.body;
        let user = new Order({title,price,category,description,image});
        let newuser = await user.save();
        res.json(newuser);
        
    } catch (error) {
        console.log(error)
    }
})

module.exports = router