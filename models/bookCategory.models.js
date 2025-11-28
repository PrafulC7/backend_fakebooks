const mongoose = require("mongoose")
const BookCategorySchema = new mongoose.Schema({
category:{
    type:String,
    required:true,
},
imageUrl:{
    type:String,
    required:true,
}
},{timestamps:true})

const BookCategory = mongoose.model("BookCategory", BookCategorySchema)

module.exports = BookCategory