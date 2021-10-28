const express = require('express');
const { randomBytes} = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');  

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts/create', (req, res) => {
    const id = randomBytes(4).toString('hex');
    const {title} = req.body;

    posts[id] = {
        id, title
    };
    try {
        axios.post('http://event-bus-srv:4005/events', {
            type: 'PostCreated',
            data: {
                id, title
            }   
        });
    } catch(error) {
        console.log(error);
    }

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => { 
    console.log('Receive Event', req.body.type);
    res.status(201).send({});
});

app.listen(4000, () => {
    console.log('vlatest')
    console.log('Listening on 4000')
})