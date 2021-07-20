const expressImport = require("express")
const serverApp = expressImport();
const bodyParser = require("body-parser")
const { v4: uuidv4 } = require('uuid');

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
var ObjectId = require('mongodb').ObjectID;
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
        console.log(req);
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
        console.log(uuidv4());
        req.body.product_id = uuidv4();
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
        console.log(req.body.price_range.lt);
        //youtube id N2XIwjXARAM for filters
        try{
            const db = await client.db();
            const usercollection = await db.collection("products");
            let whereCondition;
            if(req.body.price>0){
                whereCondition = {"price":req.body.price};
            }else if(req.body.description!=''){
                let ff = req.body.description;// How can use ff variable value place of static
                whereCondition = {"description":/Baseball/};
            }else if(req.body.price_range){
                if(req.body.price_range.gt>0 && req.body.price_range.lt>0){
                    whereCondition = {"price":{$gt:req.body.price_range.gt,$lt:req.body.price_range.lt}};    
                }else if(req.body.price_range.gt>0){
                    whereCondition = {"price":{$gt:req.body.price_range.gt}};    
                }else if(req.body.price_range.lt>0){
                    whereCondition = {"price":{$lt:req.body.price_range.lt}};    
                }
            }
            //whereCondition = {"price":{$gt:50}};

            usercollection.find(whereCondition).sort({name:1,price:-1}).toArray().then(results=> {
                console.log(whereCondition);
                res.json({products:results});
            })
        }catch(error){
            console.log(error);
        }
        
    });

    //Get Single Product Data
    serverApp.post('/get-product', async (req,res) => {
        console.log("async call ");
        console.log(req);
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
/*
var ObjectId = require('mongodb').ObjectID;
userCollection.findOne({"_id" : ObjectId("60d80b3f43eaae2eac464ced")}).then(result=>res.send(result)).catch(error=>{console.log(error)
                res.send(error)}); 
*/
    //Get Single Product Data
    serverApp.post('/get-product-byid', async (req,res) => {
        console.log("async call1 ");
        console.log(req);
        try{
            const db =  client.db('ecommercebackendDB');
            const usercollection =  db.collection("products");
            usercollection.findOne({"product_id":req.body.product_id} ).then(results=> {
                res.json({product:results});
            })
        }catch(error){
            console.log(error);
        }
        
    });

    serverApp.get('/get-product-byidNew',  function(req,res){
        console.log(req.body);
        const db =  client.db('ecommercebackendDB');
        const userCollection = db.collection('products');
         userCollection.findOne({_id:ObjectId("60f6a4720d91bcf2fb4639ea")}).then(result=>res.send(result)).catch(error=>{console.log(error)
                res.send(error)}); 
    });


}).catch(err=>{
    console.log("getting connection issue "+err);
})
