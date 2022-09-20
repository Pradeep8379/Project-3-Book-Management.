const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json())


mongoose.connect("mongodb+srv://Pankaj_:66Pbd7EVzng1k4jK@cluster0.wn2mrjr.mongodb.net/group7Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});