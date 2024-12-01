const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// const uri for database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.63kgb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    //waite for server
    await client.connect();
    const coffeeCalection = client.db("coffeeDB").collection("coffee");
    const userCollection = client.db("coffeeDB").collection("users");
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // coffees save in database
    app.post("/coffee", async (req, res) => {
      const newCoffe = req.body;
      console.log(newCoffe);
      const result = await coffeeCalection.insertOne(newCoffe);
      res.send(result);
    });

    // coffee read from database
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCalection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // update coffee
    app.put('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const options = {upsert: true};
      const updatedCoffe = req.body;
      const update = {
        $set: {
          name: updatedCoffe.name,
          quantity: updatedCoffe.quantity,
          supplier: updatedCoffe.supplier,
          taste: updatedCoffe.taste,
          category: updatedCoffe.category,
          price: updatedCoffe.price,
          details: updatedCoffe.details,
          photo: updatedCoffe.photo,
        },
      };
      const result = await coffeeCalection.updateOne(filter, update, options);
      res.send(result);
    })

    // upload coffee
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCalection.findOne(query);
      res.send(result);
    });
    //delete
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCalection.deleteOne(query);
      res.send(result);
    });


    //users related api
    app.post('/users', async(req, res)=>{
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//middleware
app.use(cors());
app.use(express.json());

//check server
app.get("/", (req, res) => {
  res.send("sakib coffee shops server is running");
});

//por
app.listen(port, () => {
  console.log(`coffee server is running on port ${port}`);
});


