const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema({
title:{
type:String,
required:true,
},
category:{
type:String,
required:true,
},
imgUrl:{
    type:String,
    required:true,
},
rating:{
    type:Number,
    min:0,
    max:5,
    default:0
},
price:{
    type:Number,
    required:true
},
quantity:{
    type:Number,
    default: 1,
        min: 1
},
description:{
    type:String,
    required:true
}
},{timestamps:true})

const BookCart = mongoose.model('BookCart', CartSchema)

module.exports = BookCart;