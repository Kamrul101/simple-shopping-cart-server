const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kjhm1xo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const shoeCollection = client.db('shoeDB').collection('shoes');
    const cartCollection = client.db('shoeDB').collection('cart');

    app.get("/shoes", async(req,res)=>{
        const result = await shoeCollection.find().toArray();
        res.send(result);
    })

    app.get("/cart", async(req,res)=>{
        const email = req.query.email;
        const query = {email: email};
        const result = await cartCollection.find(query).toArray();
        res.send(result);
    })


    app.post('/cart',async(req,res)=>{
        const item = req.body;
        const result = await cartCollection.insertOne(item);
        res.send(result)
    })

    app.delete('/cart/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await cartCollection.deleteOne(query);
        res.send(result)
      })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send("Shopping cart running")
});
app.listen(port,()=>{
    console.log(`Shopping cart running on port ${port}`);
})
