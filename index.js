const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' });
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zau4b.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("management").collection("tools");


        //AUTH

        

        // multiple data get
        app.get('/task', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        // single data get
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // POST USER
        app.post('/service', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await serviceCollection.insertOne(newUser);
            res.send(result)
        })

        app.post('/task', async (req, res) => {
            const reviews = req.body;
            const result = await taskCollection.insertOne(reviews);
            res.send(result)
        })

        // Delete 
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })

        // Data decrease and update
    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Management Tools')
})

app.listen(port, () => {
    console.log('Task Management Tool!', port)
})