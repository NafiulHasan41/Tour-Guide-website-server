const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 4000;

//middleware
app.use(cors());
app.use(express.json());


//routes


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dsubcfq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    await client.connect();
    const touristSpotCollection = client.db('tourismDB').collection('touristSpot');

    app.get('/touristSpots' , async (req , res) =>{

        const cursor = touristSpotCollection.find();
        const touristSpots = await cursor.toArray();
        res.send(touristSpots);

    })

    app.get('/touristSpots/:id' , async (req , res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await touristSpotCollection.findOne(query);
        res.send(result);
    })

   
    app.post('/touristSpots' , async (req , res) =>{

        const touristSpot=req.body;
        const result= await touristSpotCollection.insertOne(touristSpot);
        res.send(result);
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






app.get('/', (req , res ) =>{

    res.send("Server is working fine");
})

app.listen(port , () =>{

    console.log(`Server is running on port ${port}`);
})