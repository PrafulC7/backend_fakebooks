const mongoose = require("mongoose")

const WishlistSchema = new mongoose.Schema({
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
description:{
    type:String,
    required:true
}

},{timestamps:true})

const BookWishlist = mongoose.model('BookWishlist', WishlistSchema)

module.exports = BookWishlist;