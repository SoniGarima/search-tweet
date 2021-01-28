import express from "express";
var app = express();
var port = 3000;

import bodyParser from 'body-parser';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import Twit from 'twit';
var T = new Twit({
    consumer_key:         '**',
    consumer_secret:      '**',
    access_token:         '**',
    access_token_secret:  '**',
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

import mongoose from "mongoose";
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node-demo");
var twitSchema = new mongoose.Schema({
    Date: String,
    Description: String,
    User:String,
    Location:String,
    Profile:String,
    Retweeted:Number
});
var Tweet = mongoose.model("Tweet", twitSchema);

app.get("/", (req, res) => {
    res.sendFile("/home/garima/Desktop/search-tweet/node/index.html");
});

app.post("/addname", (req, res) => {
    var {keyword} = req.body;
    T.get('search/tweets', { q: keyword, count: 10 }, function(err, data, response) {
        var resp = [];
        data["statuses"].forEach(function(item){
            var dict = {Date:item["created_at"],Description:item["text"],User:item["user"]["name"],Location:item["user"]["location"],Profile:"https://twitter.com/"+item["user"]["screen_name"],Retweeted:item["retweet_count"]};
            console.log(dict);
            var myData = new Tweet(dict);
            myData.save();
            resp.push(dict);
        });
        res.send(resp);
    })
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});