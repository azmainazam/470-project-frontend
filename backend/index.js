const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectID, ObjectId } = require('mongodb');
require('dotenv').config()
const stripe = require("stripe")('sk_test_51M8jIFCRKiTr81AEKvnEw3tyA4OtC36NH3mbeCQoXwL2RsgaT0JRb877eW3uB6iH6rSRKUwYPuXkNSdZhjc8V8xx00ScTMOWKL');



const app = express();

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://470_Project:Wkns2CjYiScvixrg@cluster0.ilcuj5w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unothorized user')
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded
        next()
    })
}

async function run() {
    try {
        const usersCollection = client.db('MobileBroker').collection('users')
        const productsCollection = client.db('MobileBroker').collection('products')
        const bookingsCollection = client.db('MobileBroker').collection('bookings')
        const wishListCollection = client.db('MobileBroker').collection('wishList')
        const advertisedCollection = client.db('MobileBroker').collection('advertise')
        const paymentsCollection = client.db('MobileBroker').collection('payments')


        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email
            }
            const user = await usersCollection.findOne(query)
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
                return res.send({ accessToken: token })
            }
            res.status(403).send('Unothorised User')

        })


        app.post('/create-payment-intent', async (req, res) => {
            const booking = req.body;
            const price = booking.productPrice;
            const amount = price * 100;

            const paymentIntent = await stripe.paymentIntents.create({
                currency: 'usd',
                amount: amount,
                "payment_method_types": [
                    "card"
                ]
            });
            res.send({
                clientSecret: paymentIntent.client_secret,
            })
        })

        app.post('/payments', async (req, res) => {
            const user = req.body;
            const result = await paymentsCollection.insertOne(user)
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email };
            }
            if (req.query.role) {
                query = { role: req.query.role };
            }
            const result = await usersCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })
        app.get('/products', async (req, res) => {
            if (req.query.email) {
                query = { email: req.query.email };
                const result = await productsCollection.find(query).toArray();
                res.send(result)
            }
            if (req.query.category) {
                // query = { category: req.query.category };
                const filter = {category:req.query.category , status: 'unsold'}
                const product = await productsCollection.find(filter).toArray();
                // const filter = { status : 'unsold' };
                // const getProduct = await product.find(filter).toArray
                if(product.length > 0){
                    res.send(product)
                }
                else{
                    res.send([])
                }
            }

        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.findOne(query);
            console.log(result)
            res.send(result)
        })


        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product)
            console.log(result)
            res.send(result)
        })
        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            let query = {};
            let updatedDoc = {
                $set: {

                }
            }
            if (req.body.editedData) {
                query = { _id: ObjectId(id) }
                updatedDoc = {
                    $set: {
                        description: req.body.editedData
                    }
                }
            }
            if (req.body.status) {
                query = { _id: ObjectId(id) }
                updatedDoc = {
                    $set: {
                        status: req.body.status
                    }
                }
            }
            const result = await productsCollection.updateOne(query, updatedDoc);
            res.send(result)
            console.log(result)
        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/bookings',async (req, res) => {
            // const email = req.query.customerEmail;
            // const decodedEmail = req.decoded.email
            // if (email !== decodedEmail) {
            //     return res.status(403).send({ message: 'forbidden access' })
            // }
            let query = {};
            if (req.query.customerEmail) {
                query = { customerEmail: req.query.customerEmail };
            }
            const result = await bookingsCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingsCollection.findOne(query);
            console.log(result)
            res.send(result)
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking)
            console.log(result)
            res.send(result)
        })
        app.patch('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    paymentStatus: 'paid'
                }
            }
            const result = await bookingsCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bookingsCollection.deleteOne(query)
            res.send(result)
        })
        app.get('/wishlist', async (req, res) => {
            let query = {};
            if (req.query.customerEmail) {
                query = { customerEmail: req.query.customerEmail };
            }
            const result = await wishListCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/wishlist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await wishListCollection.findOne(query);
            console.log(result)
            res.send(result)
        })

        app.post('/wishlist', async (req, res) => {
            const wishList = req.body;
            const result = await wishListCollection.insertOne(wishList)
            console.log(result)
            res.send(result)
        })
        app.delete('/wishlist/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await wishListCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            console.log(user)
            res.send({ isAdmin: user?.role === 'admin' })
        })

        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.get('/users/varify/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            console.log(user)
            res.send({ isVarified: user?.userStatus === 'varified' })
        })
        app.put('/users/varify/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    userStatus: 'varified'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.get('/advertise', async (req, res) => {
            let query = {};
            if (req.query.productId) {
                query = { productId: req.query.productId };
            }
            const result = await advertisedCollection.find(query).toArray();
            res.send(result)
        })
        app.post('/advertise', async (req, res) => {
            const wishList = req.body;
            const result = await advertisedCollection.insertOne(wishList)
            console.log(result)
            res.send(result)
        })
        app.delete('/advertise/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await advertisedCollection.deleteOne(query)
            res.send(result)
        })

        Wkns2CjYiScvixrg


    }

    finally {

    }

}
run().catch(console.log)


app.get('/', async (req, res) => {
    res.send('mobile broker server is running')
})

app.listen(port, () => console.log(`server is running on ${port}`))