require('dotenv').config();

const express=require("express");

const mongoose=require("mongoose");

const app=express();

app.set('view engine','ejs');

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://"+ process.env.NAME +":"+ encodeURIComponent(process.env.PASSWORD) +"@cluster0.lvknf.mongodb.net/customersDB", {useNewUrlParser:true, useUnifiedTopology:true});

const customerSchema=new mongoose.Schema({ 
    Name:{ type: String},
    Email:{ type: String},
    Balance:{ type: Number}
});

const Customer=new mongoose.model("Customer",customerSchema);

const TransactionSchema=new mongoose.Schema({
    From:{ type: String},
    To:{ type: String},
    Amount:{ type: Number},
    Time: {type: Date, default: Date.now()}
});

const Transaction=new mongoose.model("Transaction",TransactionSchema);
  
var fromId=0,toId=0,amount1=0;

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/index.html");
})

app.get("/viewCustomers",function(req,res)
{
     Customer.find({},function(err,items)
    {
        res.render("customers",{users:items});
    })
})

app.post("/viewCustomers",function(req,res)
{
     res.redirect("/viewCustomers");
})

app.get("/selectedCustomer",function(req,res)
{   
    Customer.find({},function(err,items)
    {
        res.render("receiver",{users:items});
    })
})

app.post("/selectedCustomer",function(req,res)
{
    fromId=req.body.button;
   
    res.redirect("/selectedCustomer");
})

app.get("/toCustomer",function(req,res)
{
     if(fromId==toId)
     {
         res.render("success",{text:"You cannot send money to same account"});
     }
     else
     { 
    res.render("result",{x1:fromId,y1:toId});
    }
})

app.post("/toCustomer",function(req,res)
{
     toId=req.body.button1;

     res.redirect("/toCustomer");
})

app.get("/transaction",function(req,res)
{
    var s1=fromId,s2=toId;
    
    while(s1.charAt(0)==" ")
    {
        s1=s1.substring(1);
    }
    while(s2.charAt(0)==" ")
    {
        s2=s2.substring(1);
    }
    while(s1.charAt(s1.length-1)==" ")
    {
        s1=s1.substring(0,s1.length-1);
    }
    while(s2.charAt(s2.length-1)==" ")
    {
        s2=s2.substring(0,s2.length-1);
    }

    const t1=new Transaction({From:s1,To:s2,Amount:req.body.amount});

    t1.save();


    Customer.updateOne({Name:s1},{$inc:{Balance:-amount1}},function(err,items)
    {
        
    })
    Customer.updateOne({Name:s2},{$inc:{Balance:amount1}},function(err,items)
    {
        res.render("success",{text:"Transaction Successful"}); 
    })
  
})

app.post("/transaction",function(req,res)
{
     amount1=(Number)(req.body.amount);

     res.redirect("/transaction");
});

app.listen(3000,function(req,res)
{
    console.log("Server running on port 3000");
})



/*  const c1=new Customer({Name: "Bharath", Email:"bharathippa02@gmail.com",Balance: 5000});

  const c2=new Customer({Name: "Rohith", Email:"rohith.siripuam@gmail.com",Balance: 10000});

  const c3=new Customer({Name: "Madhu", Email:"madhureddybaddam2001@gmail.com",Balance: 15000});

  const c4=new Customer({Name: "Naveen", Email:"naveengudepu12@gmail.com",Balance: 8000});

  const c5=new Customer({Name: "Ganesh", Email:"edlaganesh@gmail.com",Balance: 12000});

  const c6=new Customer({Name: "Sairam", Email:"rajansaiarise@gmail.com",Balance: 11000});

  const c7=new Customer({Name: "Sai sumanth", Email:"k.saisumanth@gmail.com",Balance: 9000});

  const c8=new Customer({Name: "Srinivas", Email:"porandlasrinivas@gmail.com",Balance: 10000});

  const c9=new Customer({Name: "Rajansai", Email:"ariserajan@gmail.com",Balance: 13000});

  const c10=new Customer({Name: "abcd", Email:"abcd@gmail.com",Balance: 14000});

    Customer.insertMany([c1,c2,c3,c4,c5,c6,c7,c8,c9,c10],function(err)
    {
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("Successfully add items");
    }
    });

 */ 