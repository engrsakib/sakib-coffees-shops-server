const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
