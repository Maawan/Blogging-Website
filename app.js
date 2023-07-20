const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var getString = require('./util')
var postArray = []
var _ = require('lodash');
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const mongoose = require('mongoose')
// mongoose.connect('mongodb+srv://maawan-admin:maawan123@mydbserver.ntmdmxm.mongodb.net/blogging' , {
//     useUnifiedTopology: true
// })
mongoose.connect('mongodb://0.0.0.0:27017/blogging' , {
    useUnifiedTopology: true
})
const postSchema = new mongoose.Schema({
  name:String,
  data:String
})
const Post = new mongoose.model('Post',postSchema);
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get('/',(req,res)=>{
  Post.find().then(function(document){
    postArray = document
    res.render("home",{content1 : homeStartingContent, data : postArray})
    console.log(postArray)
  })
  
  
})
app.get('/about',(req,res)=>{
  res.render("about",{content1: aboutContent})
})
app.get('/contact',(req,res)=>{
  res.render("contact",{content1: contactContent})
})
app.get('/home',(req,res)=>{
  res.redirect('/');
})
app.get('/compose',(req,res)=>{
  res.render("compose");
})
app.post('/insertNewPost',(req,res)=>{
  const post = new Post({
    name:req.body.postTitle,
    data:req.body.postContent
  })
  post.save().then((err)=>{
    console.log(post)
    res.redirect('/post/'+post._id);
  });
})
app.post('/editNewPost/:id',(req,res)=>{
  Post.findOne({_id:req.params.id}).then((document)=>{
    document.name = req.body.postTitle
    document.data = req.body.postContent
    document.save().then((err)=>{
      res.redirect('/');
    })
  })
})
app.get('/post/edit/:ID',(req,res)=>{
  console.log(req.params.ID+ " ");
  Post.findOne({_id:req.params.ID}).then((document)=>{
    console.log(document)
    if(document == null){
      res.render('/');
    }else{
      res.render("edit",{content:document})
    }
  })
  //res.redirect('/')
})
app.get('/post/:id',(req,res)=>{
    // var post = _.lowerCase(req.params.id)
    // var isFound = false;
    // for(let i = 0 ; i < postArray.length ; i++){
    //   if(_.lowerCase(postArray[i].title) === post){
    //       isFound = true;
    //       res.render("post",postArray[i]);
    //       break;
    //   }
    // }
    Post.findOne({_id:req.params.id}).then((document)=>{
      if(document == null) res.redirect('/*');
      res.render("post",document)
    })
    
})
app.get('/api/post/:id',(req,res)=>{
  var post = _.lowerCase(req.params.id)
    var isFound = false;
    for(let i = 0 ; i < postArray.length ; i++){
      if(_.lowerCase(postArray[i].title) === post){
          isFound = true;
          res.send(postArray[i]);
          break;
      }
    }
    if(!isFound){
      res.send({
        status:'Post Unavailable'
      });
    }
})
app.get('/*',(req,res)=>{
  res.send("Kya hai bsdk ... Route galat hai ... Appkon se dekh ke daal ")
})
app.listen(process.env.PORT || 3003,()=>{
  console.log("Server Started on 3003")
});
