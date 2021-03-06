const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express(); 
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handlerEvent = (type, data) => {
    if (type === 'PostCreated') {
        const {id, title} = data;
        posts[id] = {id, title, comments: []};
    }

    if (type == 'CommentCreated') {
        const {id, content, postId, status} = data;
        const post = posts[postId];
        post.comments.push({id, content, status});
    }

    if (type === 'CommentUpdated') {
        const {id, content, postId, status} = data;
        const post = posts[postId];
        comment = post.comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req,res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type ,data } = req.body;
    console.log(type);
    handlerEvent(type, data);
    console.log(posts);
    res.send({});
});

app.listen(4002, async () => {
    console.log("Listening on port 4002");

    res = await axios.get('http://event-bus-srv:4005/events');
    for (let event of res.data) {
        console.log('Processing Events:', event.type);
        handlerEvent(event.type, event.data);
    }
});