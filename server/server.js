require('./config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

//Configuracion global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }, (err, resp) => {
    if(err){
        throw err;
    }else {
        console.log('Data Base ONLINE');
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
})