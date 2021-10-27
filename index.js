const express = require('express')
const { MongoClient } = require('mongodb');
const objectId= require('mongodb').ObjectId
const cors=require('cors')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.he9di.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('connected to db')
        const database=client.db("carMechanic")
        const serviceCollection=database.collection("servicesCollection")

        //GET API
        app.get('/services',async(req,res)=>{
            const cursor= serviceCollection.find({})
            const services =await cursor.toArray()
            res.send(services)


        })

        //GET SINGLE SERVICE
        app.get('/services/:id',async(req,res)=>{
            const id=req.params.id
            console.log('send detail of id' ,id)
            const query= {_id : objectId(id)}
            const result = await serviceCollection.findOne(query)
            res.json(result)


        })

        //POST API

        app.post('/services',async(req,res)=>{
         
           const service= req.body
           console.log('hit the api',service)
const result = await serviceCollection.insertOne(service)

console.log(result)
res.json(result)
        })

        //DELETE API

        app.delete('/services/:id',async(req,res)=>{
            const id= req.params.id 
            const query= {_id: objectId(id)}
            const result=await serviceCollection.deleteOne(query)
            res.json(result)
        })


    }
    finally{
// await client.close()
    }

} 
run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('running genius server')
})

app.listen(port,()=>{
    console.log('running genius server on port',port)
})