// const fs = require("fs");
// const jsonData = fs.readFileSync('fakeBooks.json', 'utf-8')
// const booksData = JSON.parse(jsonData)

const express = require("express")
const app = express()
app.use(express.json())
const cors = require("cors");
const corsOptions = {
  origin: [
    "https://book-shop-app-sable.vercel.app/",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const {initializeDatabase} = require("./db/db.connect")
const FakeBook = require("./models/book.models")
const BookWishlist = require("./models/bookWishlist.models")
const BookCart = require("./models/bookCart.models");
const BookOrder = require("./models/bookOrder.models");
const BookCategory = require("./models/bookCategory.models");
initializeDatabase()

async function getAllBooks(){
  try{
const allBooks = await FakeBook.find()
return allBooks;
  }catch(err){
    throw err
  }
}

app.get("/books", async (req,res)=>{
  try{
const books = await getAllBooks()
res.send(books)
  }catch(err){
res.status(404).json({error:"books not found"})
  }
})
//--------------------------------------------
// WishList
//--------------------------------------------
async function getWishlist(){
  try{
const wishlist = await BookWishlist.find()
return wishlist;
  }catch(err){
    throw err
  }
}

app.get("/wishlist", async (req,res)=>{
  try{
const books = await getWishlist()
res.send(books)
  }catch(err){
res.status(404).json({error:"books not found"})
  }
})



app.post("/wishlist/add", async (req, res) => {
  try {
    const { title } = req.body;

    // check if book already exists in wishlist
    const exists = await BookWishlist.findOne({ title });

    if (exists) {
      return res.status(400).json({ msg: "Book already exists in wishlist" });
    }

    // add new book
    const newBook = new BookWishlist(req.body);
    await newBook.save();

    // return updated wishlist
    const allItems = await BookWishlist.find();
    res.json(allItems);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/wishlist/delete/:id", async (req,res)=>{
  try{
    const id = req.params.id;
await BookWishlist.findByIdAndDelete(id);
const allItems = await BookWishlist.find();
    res.json(allItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

//--------------------------------------------
// Cart
//--------------------------------------------

async function getCart(){
  try{
    const cart = await BookCart.find()
    return cart;
  }catch(err){
    throw err
  }
}

app.get("/cart", async(req,res)=>{
  try{
    const books = await getCart()
    res.send(books)
  }catch(err){
    res.status(400).json({error:"books not found"})
  }
})

// async function createCart(newBook) {
//   try{
//   const book = new BookCart(newBook);
//   const saveBook = await book.save()
//   return saveBook;
//   }catch(err){
//     throw err
//   }
// }
app.post("/cart/add", async(req,res)=>{
  try {
    const { title } = req.body;

    const exists = await BookCart.findOne({ title });

    if (exists) {
      return res.status(400).json({ msg: "Book already exists" });
    }

    const newBook = new BookCart(req.body);
    await newBook.save();

    const allItems = await BookCart.find();
    res.json(allItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.delete("/cart/delete/:id", async(req,res)=>{
  try{
    const id = req.params.id;

    await BookCart.findByIdAndDelete(id);

    const allItems = await BookCart.find();
    res.json(allItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

// async function updateCart(bookTitle, dataToUpdate){
//   try{
//     const updatedBook = await BookCart.findOneAndUpdate({title:bookTitle}, dataToUpdate, {new: true,})
//     return updatedBook;
//   }catch (error){
//     console.log("Error in updating Book quantity", error);
//   }
// }

app.put("/cart/increase/:id", async(req, res)=>{
  try {
    const id = req.params.id;

    await BookCart.findByIdAndUpdate(id, { $inc: { quantity: 1 } },
      { new: true }
    );

    const allItems = await BookCart.find();
    res.json(allItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.put("/cart/decrease/:id", async (req, res) => {
  try {
    await BookCart.findByIdAndUpdate(req.params.id, {
        $inc: { quantity: -1 }
      });

//     const item = await BookCart.findById(req.params.id);
// if (!item) return res.status(404).json({ msg: "Not found" });
// if (item.quantity === 1) {
//       await BookCart.findByIdAndDelete(req.params.id);
//     } else {
//       }

    const allItems = await BookCart.find();
    res.json(allItems);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.get("/orders", async (req, res) => {
  try {
    const orders = await BookOrder.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/orders/place", async (req, res) => {
  try {
    const { items, name, email, phone, address, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }
// const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
// Save order
    const newOrder = new BookOrder({
      items,
      name,
      email,
      phone,
      address,
      totalAmount,
    });

    await newOrder.save();
const orders = await BookOrder.find();
// Optional: clear cart after order placed
await BookCart.deleteMany({});
res.json(orders);

    // res.json({ msg: "Order placed successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// async function createOrder(newOrder){
//   try{
//     const order = new BookOrder(newOrder);
//     const saveOrder = await order.save();
//     return saveOrder;
//   }catch(err){
//     throw err
//   }
// }

// app.post("/orders", async(req, res)=>{
//   try{
// const savedOrder = await createOrder(req.body)
// res.status(201).json({message:"Order placed successfully", order: savedOrder})
//   }catch(error){
//     res.status(400).json({message: "Error placing order", error});
//   }
// })

//--------------------------------------------
// Categories
//--------------------------------------------

async function getCategories(){
  try{
const categories = await BookCategory.find()
return categories;
  }catch(err){
    throw err
  }
}

app.get("/categories", async(req, res)=>{
  try{
const categories = await getCategories()
res.send(categories)
  }catch(err){
    res.status(404).json({err:"categories not found"})
  }
})

async function createCategory(newCategory){
  try{
const category = new BookCategory(newCategory)
const saveCategory = await category.save()
return saveCategory;
  }catch(err){
    throw err
  }
}

app.post("/categories", async(req, res)=>{
  try{
    const savedCategory = await createCategory(req.body)
    res.status(201).json({message:"Category created successfully", category: savedCategory});
  }catch(error){
    res.status(400).json({message:"Error creating category", error})
  }
})

const PORT = 3000
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`)
})