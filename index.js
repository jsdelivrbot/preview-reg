const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
pgp.pg.defaults.ssl = true;

const db = pgp(process.env.DATABASE_URL);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');
});

app.post('/newevent', function (request, response) {
  console.log(JSON.stringify(request.body));
  let organizer = request.body.organizer;
  let begin_time = request.body.begin_time;
  let end_time = request.body.end_time;
  let place = request.body.place;
  let description = request.body.description;

  db.none('INSERT INTO events(organizer,begin_time,end_time,place,description) VALUES($1, $2, $3, $4, $5);', [organizer, begin_time, end_time, place, description])
    .then(() => {
      console.log('new stats inserted to database');
      response.send('event created');
    })
    .catch(error => {
      console.log(error);
      response.send(error);
    });

});

app.get('/removeall', function (request, response) {
  db.none('DELETE FROM events;')
    .then(() => {
      console.log('Removed all events');
      response.send('Deleted');
    })
    .catch(error => {
      console.log(error);
      response.send(error);
    });
});

app.get('/allevents', function(request, response){
  db.manyOrNone('SELECT * FROM events;')
  .then((data)=>{
    response.send(data);
  })
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
