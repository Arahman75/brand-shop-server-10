const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const corsConfig = {
    origin: [
        'http://localhost:5173',
        'https://auto-mobile-brand.web.app',
        'https://auto-mobile-brand.firebaseapp.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig));
app.use(express.json());



// middleware
// app.use(cors());
// app.use(express.json())

// automotiveBrand
// AwmJGwlmoMDD3nRp



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ik9fyhp.mongodb.net/?retryWrites=true&w=majority`;


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
        // await client.connect();

        const brandCollection = client.db('automotiveDB').collection('brands');
        const productCollection = client.db('automotiveDB').collection('products');

        // get the brand
        app.get('/brands', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // post product
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
        })

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result)
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('update id', id);
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result)
        })

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateProduct = req.body;
            const product = {
                $set: {
                    name: updateProduct.name,
                    brandName: updateProduct.brandName,
                    price: updateProduct.price,
                    description: updateProduct.description,
                    rating: updateProduct.rating, image: updateProduct.image
                }
            }
            const result = await productCollection.updateOne(filter, product, options);
            res.send(result)
        })

        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Brand server is running')
})

app.listen(port, () => {
    console.log(`Brand server is running port ${port}`)
})