//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();
mongoose.connect("mongodb://localhost:27017/toDoList2", {
  useNewUrlParser: true
});

const blogSchemaLarge = new mongoose.Schema({
  title: String,
  content: String
})
const blogSchemaSmall = new mongoose.Schema({
  title: String,
  content: String
})
//blogsLarge and blogsSmall are collections name
const blogsLarge = mongoose.model("blogsLarge", blogSchemaLarge);
const blogsSmall = mongoose.model("blogsSmall", blogSchemaSmall);
app.set('view engine', 'ejs');
const home = new blogsSmall({
  title: "Hello",
  content: homeStartingContent
})

const defaultitem = [home];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.get("/", function(req, res) {

      blogsSmall.find({}, function(err, foundItems) {
        console.log(foundItems);
          if (err) {
            console.log("error");
          } else {
            if (foundItems.length === 0) {
              blogsSmall.insertMany(defaultitem, function(err) {
                if (err) {
                  console.log("error");
                } else {
                  console.log("Welcome on your first item");
                }
              });
              res.redirect("/");
            } else {
              res.render("home", {
                posts: foundItems
              });
            }
          }
      });
    });
    app.get("/about", function(req, res) {

      res.render("about", {
        about: aboutContent
      });
    });
     app.get("/contact", function(req, res) {

      res.render("contact", {
        contact: contactContent
      });
    });
     app.get("/compose", function(req, res) {

      res.render("compose");
    });
    app.get("/posts/:index", function(req, res) {
      var index = req.params.index;
      blogsLarge.find({},function(err,result)
    {
      if(err)

      {
        console.log("error");
      }
      else {
      result.forEach(function(element) {
        if (_.lowerCase(index) == _.lowerCase(element.title)) {
          res.render("post", {
            obj:element
          });
        }
      });
    }
      });
    });

    app.post("/compose", function(req, res) {

      var post = new blogsLarge({
        title: req.body.title,
        content: req.body.content
      });
      post.save();
      if (post.content.length > 100) {

        let smallstring = post.content.substr(0, 100);
        smallstring += "....";
        var smallpost = new blogsSmall({
          title: req.body.title,
          content: smallstring
        })
        smallpost.save();
      }
      res.redirect("/");

    })


    app.listen(process.env.PORT||3000, function() {
      console.log("Server started on port 3000");
    });
