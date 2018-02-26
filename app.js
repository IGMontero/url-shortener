var express = require('express'),
    app = express(),
    mongo = require('mongodb').MongoClient,
    encoder = require('./encoder.js'),
    Url = require('./models/url.js'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    config = require('./config.js'),
    encoder = require('./encoder.js');

var mongoUrl = "mongodb://"+config.db.host+"/"+config.db.name+"";


//Body parser config
//handles json bodies
app.use(bodyParser.json());
//handles urlencoded bodies
app.use(bodyParser.urlencoded({extended:true}));

//Serve files from /views and /public
app.use(express.static(__dirname+"/views"));
app.use(express.static(__dirname+"/public"));

//Conect to the database.
mongoose.connect(mongoUrl);


app.get("/",function(req,res){
  res.render('index');
})


app.post('/api/shorten',function(req,res){
  
  var url = req.body.url;
  var shorturl='';
  
  if(!validateUrl(url)){
    res.send({error:'Invalid url.'});
  }
  
  //Search if it has been inserted before.
  //If it was already inserted, encode it
  // If it was not, insert it and encode it.
  Url.findOne({long_url:url},function(err,data){
    if(err)
      throw err;
    
    console.log("FOUND!");
    //Already inserted.
    if(data){
      shorturl = config.webHost + encoder.encode(data._id);
      res.send({
        long_url:data.long_url,
        short_url:shorturl
      });
    }else{
      
      //Create the url object to insert.
      var newUrl = new Url({
        long_url:url
      });
      
      //When saved, it gets an updated _id and date.
      newUrl.save(function(err){
        if(err)
          throw err
      })
      
      shorturl = config.webHost + encoder.encode(newUrl._id);
      
      res.send({
        long_url:url,
        short_url:shorturl
      }) 
    }
  })
})


//If the passed code was in the database, redirect the user to its link , else send an error message as an object.
app.get("/:encoded_url",function(req,res){
  
  var code = req.params.encoded_url;
  var id = encoder.decode(code);
  
  Url.findOne({_id:id},function(err,data){
    if(err)
      throw err;
    
    if(data){
      
      res.redirect(data.long_url);
      
    }else{
      res.send({error:'This url is not in the database.'});
    }
    
  })
  
})


app.get("*",function(req,res){
  res.send({error:"This url is not in the database."})
})


app.listen(process.env.PORT,function(){
  console.log("Server started, listening to port: "+process.env.PORT);
});

//Function extracted from https://stackoverflow.com/questions/8667070/javascript-regular-expression-to-validate-url
function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}