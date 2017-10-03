const express = require('express');
const app = express();
const pgp = require('pg-promise')();
pgp.pg.defaults.ssl = true;


const db = pgp(process.env.DATABASE_URL);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/newevent', function(request, response){
  
});

app.get('/removeall', function(request, response) {
  response.send('');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
