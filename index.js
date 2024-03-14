
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1,strict: true,deprecationErrors: true,}});

async function run() {
  try{
    await client.connect();
    const postCollection=client.db("database").collection('posts'); //post collection
    const userCollection=client.db("database").collection('users'); //user collection

    //get
    app.get('/post', async (req,res)=>{
      const post=(await postCollection.find().toArray()).reverse();
      res.send(post);
    })

    app.get('/user', async (req,res)=>{
      const user=await userCollection.find().toArray();
      res.send(user);
    })

    app.get('/loggedInUser', async (req,res)=>{
      const email= req.query.email;
      const user=await userCollection.find({email:email}).toArray();
      res.send(user);
    })
    app.get('/userPost', async (req,res)=>{
      const email= req.query.email;
      const post=(await postCollection.find({email:email}).toArray()).reverse();
      res.send(post);
    })

    //post
    app.post("/post",async (req,res)=> {
      const post=req.body;
      const result=await postCollection.insertOne(post);
      res.send(result);
      })

      app.post("/register",async (req,res)=> {
        const user=req.body;
        const result=await userCollection.insertOne(user);
        res.send(result);
        })

    // patch
    app.patch('/userUpdates/:email',async(req,res)=>{
      const filter = req.params;
      const profile = req.body;
      const options = {upsert:true};
      const updateDoc = {$set: profile};
      const result = await userCollection.updateOne(filter,updateDoc ,options);
      res.send(result);
    })

  }catch(error){
    console.log(error);
  }
}run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World.......!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})