const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: 'config.env' })

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)

// mongoose.connect('mongodb+srv://JoanneWei:19920714@cluster0.lubz6.mongodb.net/week4')
mongoose.connect(DB)
  .then(()=>console.log('資料庫連線成功'))
  .catch(err=> console.log(err))
