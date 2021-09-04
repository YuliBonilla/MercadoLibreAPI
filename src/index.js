const express = require('express')
const morgan = require('morgan')
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set('json spaces',2)

app.use(require('./routes/index'));

app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});