const express  = require('express');
const hbs = require('hbs');
const getIP = require('ipware')().get_ip;
const fs = require('fs');
const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs');

app.use(express.static(__dirname+'/public'));
app.use((req,res,next) => {
  var now = new Date().toString();
  var message = `${now} ${req.method} ${req.url} ${req.connection.remoteAddress}`;
  console.log(message, getIP(req));
  fs.appendFile( __dirname +'/log.log',message, (error) =>{
    if(error)
      console.log('Could not write into the file', error);
  });
  next();
});

// app.use((req,res,next) => {
//   res.render(__dirname + '/views/maintenance');
// } );

hbs.registerHelper('getCurrentYear', () =>{
  return new Date().getFullYear();
});

hbs.registerHelper('screemIt' , (text) => {
    return text.toUpperCase();
});

app.get('/',(req,res) => {
  res.render('home.hbs' ,  {
    title : 'Home Page'
  });
});

app.get('/bad',(req,res) =>{
  res.send({
    errorMessage : 'This is error page'
  });
});

app.get('/about',(req,res) =>{
  res.render('about.hbs',{
    title: 'about page',
    year : new Date().getFullYear()
  });
});

app.listen(port, () => {
  console.log(`App server is running on port ${port}`);
});
