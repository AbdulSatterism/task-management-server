const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hlsud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const tasksCollection = client.db('taskManagement').collection('tasks');
        const usersCollection = client.db('taskManagement').collection('users');

        //task post in database
        app.post('/tasks', async (req, res) => {
            const tasks = req.body;
            const result = await tasksCollection.insertOne(tasks);
            res.send(result);
        });
        app.get('/tasks', async (req, res) => {
            const query = {};
            const result = await tasksCollection.find(query).toArray();
            res.send(result)
        })
        // get task by email
        app.get('/tasks-by-email', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            const query = { email: email };
            const result = await tasksCollection.find(query).toArray();
            res.send(result)
        })
        //delete  task 
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
            res.send(result)
        })

        // update status 
        app.patch('/tasks/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updateStatus = {
                $set: {
                    status: 'solved'
                }
            }

            const result = await tasksCollection.updateOne(filter, updateStatus);
            res.send(result)
        })
        //save user in database
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.send(result)
        })
        //


    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Task management!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})