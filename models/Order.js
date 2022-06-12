const mongoose = require('mongoose')
const OrderSchema =new mongoose.Schema({
    title:{type: String, required: true},
    price:{type: Number, required: true},
    category:{type: String},
    description:{type: String},
    image:{type: String, required: true}
})

const Order= mongoose.model('Order',OrderSchema)

module.exports = Order;