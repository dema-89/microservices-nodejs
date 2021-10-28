const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const {type, data } = req.body;

    if (type === 'CommentCreated') {
        console.log('comment created');
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
        try {
            await axios.post('http://event-bus-srv:4005/events', {
                type: 'CommentModerated',
                data: {
                    id: data.id,
                    postId: data.postId,
                    status: status,
                    content: data.content
                }
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    res.status(201).send({}); 
});

app.listen(4003, () => {
    console.log('Listening on port 4003')
})