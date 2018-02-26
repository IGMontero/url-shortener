var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Counter schema with _id and seq fields.
var CounterSchema = new Schema({
  _id:{type:String, required:true},
  seq:{type:Number,default:0}
});

//Counter model
var counter = mongoose.model("counter",CounterSchema);

//Url schema
var UrlSchema = new Schema({
  _id:{type:Number , default:0},
  long_url:String,
  created:Date
});

var url = mongoose.model("url",UrlSchema);


//Everytime a new URL is saved, counter's seq needs to increase by one

UrlSchema.pre('save',function(next){
  //Get the data to be saved.
  var data = this;
  
  //Update the count.
  counter.findByIdAndUpdate({_id:'url_count'},{$inc:{seq:1}},function(err,count){
    if(err)
      throw err;
    
    data._id = count.seq;
    data.created = new Date();
    
    next();
    
  })
})

module.exports = url;