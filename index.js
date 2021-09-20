const express = require('express');
const bp = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const app  = express();

mongoose.connect('mongodb://localhost:27017/twitter');


app.use(bp.json());
app.use(bp.urlencoded({extended: true}));

const userSchema = new Schema({
    name: String,
    age: Number
})

ObjectId = Schema.ObjectId;

const postSchema = new Schema({
    title: String,
    description: String,
    user_id: ObjectId 
})


const User = mongoose.model('user', userSchema)
const Post = mongoose.model('post', postSchema)


app.post('/users', (req, res) => {
    const user = new User({
        name: req.body.name,
        age: req.body.age
    })
    user.save(function(err){
        if(err) {
            res.send(err)
        }
        res.send('data saved')
    })
})

app.get('/users', (req,res)=>{
    User.find({}, function(err, docs){
        if(err) {
            res.send(err)
        }
        res.send(docs)
    })
})

app.get('/user/:id', (req, res) => {
    const id = req.params.id;

    User.findById(id, function(err, doc){
        if(err) {
            res.send(err)
        }
        res.send(doc)
    })
})


app.put('/user/:id', (req, res) => {
    const userData = {
        name: req.body.name,
        age: req.body.age
    }

    const id = req.params.id;

    User.findByIdAndUpdate(id, userData, function(err) {
        if(err) {
            res.send(err)
        }
        res.send("200 ok")
    })
})


app.delete('/user/:id', (req, res) => {
    const id = req.params.id;

    User.findByIdAndDelete(id, function(err) {
        if(err) {
            res.send(err)
        }  
    })
})




app.post('/posts/:user_id', (req, res) => {
    const user_id = req.params.user_id; 

    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        user_id: user_id
    })

    post.save(function(err){
        if(err) {
            res.send(err)
        }
        res.send('posts are saved')
    })
})

app.get('/posts/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    Post.find({user_id: user_id}, function(err, docs){
        if(err) {
            res.send(err)
        }
        res.send(docs)
    })
})


app.put('/post/:id/:user_id', (req, res) => {
    const postData = {
        title: req.body.title,
        description: req.body.description
    }

    const id = req.params.id;
    const user_id = req.params.user_id;

    Post.findById(id, function(err, doc){
        if(err) {
            res.send(err)
        }
        let new_id = String(doc.user_id);
        if(user_id == new_id) {
            Post.findByIdAndUpdate(id, postData, function(err) {
                if(err) {
                    res.send(err)
                }
                res.send("200 ok")
            })
        } else {
            res.send("other user");
        }
    })
    
})

app.delete('/post/:id/:user_id', (req, res) => {

    const id = req.params.id;
    const user_id = req.params.user_id;

    Post.findById(id, function(err, doc){
        if(err) {
            res.send(err)
        }
        let new_id = String(doc.user_id);
        if(user_id == new_id) {
            Post.findByIdAndDelete(id, function(err) {
                if(err) {
                    res.send(err)
                }  
                res.send("200 ok");
            })
        } else {
            res.send("other user");
        }
    })

    
})



app.listen(3000);