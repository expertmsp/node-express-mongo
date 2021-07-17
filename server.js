const expressImport = require("express")
const serverApp = expressImport();
const bodyParser = require("body-parser")

const port = 5000;

serverApp.get("/",function(req,res){
    res.sendFile(__dirname+ '/views/index.html');
})
serverApp.get("/contact-us",function(req,res){
    res.sendFile(__dirname+ '/views/contact-us.html');
})
serverApp.listen(port,function(){
    console.log("server created on port "+port)
})

// parse application/x-www-form-urlencoded
serverApp.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
serverApp.use(bodyParser.json())

//Import the functionality of Mongo Client nodejs driver
const MongoClient = require("mongodb").MongoClient;
const connectionString = 'mongodb+srv://root:aJ8ylZpOlhO6VLOW@cluster0.nw3fs.mongodb.net/ecommercebackendDB?retryWrites=true&w=majority';
//const port = 5000;

MongoClient.connect(connectionString, {useUnifiedTopology:true}).then(client =>{
    console.log("connected to database");
    //Create Data
    serverApp.post('/register', async (req,res) => {
        console.log("async call ");
        try{
            const db = await client.db();
            const usercollection = await db.collection("users");
            usercollection.insertOne(req.body)
            res.json({notes: 'Data Inserted'});
        }catch(error){
            console.log(error);
        }
        
    });
    //Login Data
    serverApp.post('/login', async (req,res) => {
        console.log("async call ");
        try{
            const db = await client.db();
            const usercollection = await db.collection("users");
            usercollection.findOne({"email":req.body.email,"password":req.body.password}).then(results=> {
                console.log(results);
                res.json({users:results});
            })
        }catch(error){
            console.log(error);
        }
        
    });

    //Create Product Data
    serverApp.post('/add-product', async (req,res) => {
        console.log("async call ");
        try{
            const db = await client.db();
            const usercollection = await db.collection("products");
            usercollection.insertOne(req.body)
            res.json({notes: 'Product Data Inserted'});
        }catch(error){
            console.log(error);
        }
        
    });
    //Get Products Data
    serverApp.get('/products', async (req,res) => {
        console.log("async call ");
        try{
            const db = await client.db();
            const usercollection = await db.collection("products");
            usercollection.find().toArray().then(results=> {
                console.log(results);
                res.json({products:results});
            })
        }catch(error){
            console.log(error);
        }
        
    });

    //Get Single Product Data
    serverApp.post('/get-product', async (req,res) => {
        console.log("async call ");
        try{
            const db = await client.db();
            const usercollection = await db.collection("products");
            usercollection.findOne({"name":req.body.name}).then(results=> {
                console.log(results);
                res.json({product:results});
            })
        }catch(error){
            console.log(error);
        }
        
    });

    //Get Single Product Data
    serverApp.post('/get-product-byid', async (req,res) => {
        console.log("async call ");
        try{
            const db = await client.db();
            const usercollection = await db.collection("products");
            usercollection.findOne({"_id":req.body.id}).then(results=> {
                console.log(req.body.id);
                res.json({product:results});
            })
        }catch(error){
            console.log(error);
        }
        
    });


}).catch(err=>{
    console.log("getting connection issue "+err);
})
