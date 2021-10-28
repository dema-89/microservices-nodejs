const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;
    events.push(event);
    try {
        axios.post('http://posts-srv-cluster-ip:4000/events', event);
        console.log('4001 - OK');
        axios.post('http://comments-srv:4001/events', event);
        console.log('4002 - OK');
        axios.post('http://query-service-srv:4002/events', event);
        console.log('4003 - OK');
        axios.post('http://moderation-srv:4003/events', event);
        console.log('4004 - OK');
    } catch (error) {
        console.log(error.message);
    }

    res.send({status: "OK"});
}
);

app.get('/events', (req, res) => {
    res.send(events);
})

app.listen(4005, () => {
    console.log('Listening on port 4005');
})