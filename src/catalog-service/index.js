const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');
const axios = require("axios")
const path = require('path');
const cors = require("cors")
const redis = require('redis');
const util = require("util")

const client = redis.createClient({ url: 'redis://localhost:6379' });

client.set = util.promisify(client.set);
client.get = util.promisify(client.get);

// Handle Redis client errors
client.on("error", (err) => {
  console.error(`Redis Error: ${err}`);
});


const app = express();
const port = 3005;

app.use(express.json());
app.use(cors())

let orderPrice =0;
let numberIt ;
let test;
let lastResult;
let lastText;
app.post("/order",(req,res)=>{
  const order = req.body
  const searchId = req.body.id
  const orderCost = req.body.orderCost
  
db.all(`SELECT * FROM items WHERE id = ?`, [searchId], (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }
    
    if (!!row[0]) {
      numberIt = row[0].quantity;
      orderPrice = row[0].price;
      let numberOfItems = row[0].quantity-1;
      console.log(orderPrice)
      console.log(orderCost)
      
      if (orderCost >= orderPrice) {
        
        const remainingAmount = orderCost - orderPrice;
        db.run(
  `UPDATE items SET quantity = ? WHERE id = ?`,
  [numberOfItems, searchId],
  async function (err) {
    if (err) {
      console.error('Error updating record:', err.message);
      return;
    }

    await client.del(`${searchId}`);
    await client.del(`${row[0].bookTopic}`); // Invalidate search cache too
  }
);
      }
      
      
    } 
    db.all(`SELECT * FROM items WHERE id = ?`, [searchId], (err, updatedRow) => {
      if (err) {
          console.error(err.message);
          return;
        }
      if(updatedRow){
        // console.log({ numberOfItemsBeforeUpdate:numberIt,data: updatedRow[0]})
        
        if(updatedRow.length != 0){
          // console.log(updatedRow[0],"eeee")
          test = { numberOfItemsBeforeUpdate:numberIt,data: updatedRow}
          if(numberIt === updatedRow[0].quantity){
            lastResult = false
          }
          else{
            lastResult = true
          
          }
          lastText = `Bought book ${updatedRow[0].title}`
        }
        // console.log(test)
        if(lastResult)
          res.send({result:{status:"success",message:lastText}});
        else
          res.send({result:{status:"fail",message:"Failed to buy The book!!"}})
      }  
      
    })
    
  });
 

});



db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY ,  
    topic TEXT,
    quantity INTEGER ,
    price INTEGER,  
    title TEXT
  )`
  );
  // db.run(
  //   // i used INSERT OR REPLACE for nodemon
  //   'INSERT OR REPLACE INTO items (id, topic , quantity, price , title ) VALUES (?, ?, ?, ?,?)',
  //   [1,"Distributed System", 1000, 3000, 'How to get a good grade in DOS in 40 minutes a day']
  // );
  // [1,"Distributed System", 1000, 3000, 'How to get a good grade in DOS in 40 minutes a day']
  // [3,"Undergraduate School", 12, 1000, 'Xen and the Art of Surviving Undergraduate School']
  // [4,"Undergraduate School", 21, 900, 'Cooking for the Impatient Undergrad']
});

app.get('/search/:topic',async (req, res) => {
  let topic = req.params.topic.trim();
  console.log(topic);
  const cachedPost = await client.get(`${topic}`)
  console.log(cachedPost,"---")
  if(cachedPost){
    return res.json(JSON.parse(cachedPost))
  }
  db.serialize(() => {
    db.all(`SELECT * FROM items WHERE topic="${topic}"`, (err, row) => {
      if (err) {
        console.log(err);
        return;
      }
      for (i = 0; i < row.length; i++) {
        console.log(
          row[i].id,
          row[i].quantity,
          row[i].price,
          row[i].topic
        );
       
      }

      client.set(`${topic}`,JSON.stringify(row))
      // console.log(row);
      res.send({items:row});
    });
  });
});

app.get('/info/:id',async (req, res) => {
  let id = req.params.id;
  console.log(id);
  const cachedPost = await client.get(`${id}`)
  // console.log(cachedPost)
  /////////////////////////////
  db.serialize(() => {
    // i used serialize to solve of close data base for data displayed completely
    db.all(`SELECT id,quantity,price FROM items WHERE id=${id}`,async (err, row) => {
      if (err) {
        console.log(err);
        return;
      }
      if(cachedPost){
        let temp = JSON.parse(cachedPost)
        console.log(row[0].quantity,"--")
        console.log(temp.quantity,"--")
        if(row[0].quantity == temp.quantity)
          return res.json(JSON.parse(cachedPost))
        else{
          client.del(`${id}`)
          return res.json({Message:"Invalidate"})
        }
      }
      client.set(`${id}`,JSON.stringify(row[0]))
      console.log(row);
      res.json({item:row});
    });
  });
});

// app.get("/posts/:id",async (req,res)=>{
//   const id = req.params.id;
//   console.log(id)
//   const cachedPost = await client.get(`post-${id}`)
//   if(cachedPost){
//     return res.json(JSON.parse(cachedPost))
//   }
//   const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
//   client.set(`post-${id}`,JSON.stringify(response.data), "EX", 360) // EX --> refer to Expire ,  5 --> refer to 5 seconds

//   res.json(response.data)
// })

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


