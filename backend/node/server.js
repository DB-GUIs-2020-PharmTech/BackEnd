const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

//mysql connection
var connection = mysql.createConnection({
  host: '10.59.43.164',
  port: '3306',
  user: 'dbgui',
  password: 'dbgui',
  database: 'pharmtech'
});

//set up some configs for express.
const config = {
  name: 'sample-express-app',
  port: 8000,
  host: '0.0.0.0',
};

//create the express.js object
const app = express();

//create a logger object.  Using logger is preferable to simply writing to the console.
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));
app.use(ExpressAPILogMiddleware(logger, { request: true }));

//Attempting to connect to the database.
connection.connect(function (err) {
  if (err)
    logger.error("Cannot connect to DB!");
  logger.info("Connected to the DB!");
});

//GET /
app.get('/', (req, res) => {
  res.status(200).send('Go to 0.0.0.0:3000.');
});

//inventory for pharmacist and doctor
app.get('/GetInventory', (req, res) => {
  connection.query('SELECT d.name, i.quantity, i.exp_date FROM `pharmtech`.`inventory` i join `pharmtech`.`drugs` d on d.id = i.drug_id', function (err, rows, fields) {
    if (err) {
      logger.error("Error while executing Query");
      res.status(400).json({
        "data": [],
        "error": "MySQL error"
      })
    }
    else{
      res.status(200).json({
        "data": rows
      });
    }
  });
});

//pharmacy revenues
app.get('/pharmacyrev', (req, res) => {
  connection.query('SELECT d.name, d.sell_price * p.quantity FROM `pharmtech`.`perscriptions` p join `pharmtech`.`drugs` d on d.id = p.drug_id WHERE p.fill_date IS NOT NULL', function (err, rows, fields) {
    if (err) {
      logger.error("Error while executing Query");
      res.status(400).json({
        "data": [],
        "error": "MySQL error"
      })
    }
    else{
      res.status(200).json({
        "data": rows
      });
    }
  });
});

//pharmacy expenses
app.get('/pharmacyexp', (req, res) => {
  connection.query('SELECT d.name, d.purchase_price * io.quantity FROM `pharmtech`.`inventory_orders` io join `pharmtech`.`drugs` d on d.id = io.drug_id WHERE io.fulfill_date IS NOT NULL', function (err, rows, fields) {
    if (err) {
      logger.error("Error while executing Query");
      res.status(400).json({
        "data": [],
        "error": "MySQL error"
      })
    }
    else{
      res.status(200).json({
        "data": rows
      });
    }
  });
});

//pharmacy sales
app.get('/pharmacysales', (req, res) => {
  connection.query('SELECT u.first_name, u.last_name, d.name, d.sell_price FROM `pharmtech`.`perscriptions` p join `pharmtech`.`drugs` d on d.id = p.drug_id join `pharmtech`.`user` u on u.id = p.patient_id WHERE p.fill_date IS NOT NULL LIMIT 5', function (err, rows, fields) {
    if (err) {
      logger.error("Error while executing Query");
      res.status(400).json({
        "data": [],
        "error": "MySQL error"
      })
    }
    else{
      res.status(200).json({
        "data": rows
      });
    }
  });
});

//pharmacist incoming orders
app.get('/pharmacyincoming', (req, res) => {
  connection.query('SELECT * FROM `pharmtech`.`perscriptions` WHERE fill_date IS NULL', function (err, rows, fields) {
    if (err) {
      logger.error("Error while executing Query");
      res.status(400).json({
        "data": [],
        "error": "MySQL error"
      })
    }
    else{
      res.status(200).json({
        "data": rows
      });
    }
  });
});

//pharmacist outgoing orders
app.get('/pharmacyoutgoing', (req, res) => {
  connection.query('SELECT * FROM `pharmtech`.`perscriptions` WHERE fill_date IS NOT NULL', function (err, rows, fields) {
    if (err) {
      logger.error("Error while executing Query");
      res.status(400).json({
        "data": [],
        "error": "MySQL error"
      })
    }
    else{
      res.status(200).json({
        "data": rows
      });
    }
  });
});

//cart
app.get('/getCart', (req, res) => {
  connection.query('SELECT name, description, purchase_price, rec_stock_amount, unit_measure, drug_type FROM `pharmtech`.`drugs`', function (err, rows, fields) {
    if (err) {
      logger.error("Error while executing Query");
      res.status(400).json({
        "data": [],
        "error": "MySQL error"
      })
    }
    else{
      res.status(200).json({
        "data": rows
      });
    }
  });
});


//inventory for manufacturer
app.get('/manufacturerinventory', (req, res) => { 
  connection.query('SELECT * FROM `pharmtech`.`XXXX`', function (err, rows, fields) {
    if (err) {
      logger.error("Error while executing Query");
      res.status(400).json({
        "data": [],
        "error": "MySQL error"
      })
    }
    else{
      res.status(200).json({
        "data": rows
      });
    }
  });
});

//outgoing orders for manufacturer
app.get('/manufacturerinventory', (req, res) => { 
  connection.query('SELECT * FROM `pharmtech`.`inventory_orders` WHERE fulfill_date IS NOT NULL', function (err, rows, fields) {
    if (err) {
      logger.error("Error while executing Query");
      res.status(400).json({
        "data": [],
        "error": "MySQL error"
      })
    }
    else{
      res.status(200).json({
        "data": rows
      });
    }
  });
});

//POST
//add inventory item
app.post('/addInventory', (req, res) => {
  console.log(req.body.product);

  connection.query('INSERT INTO `pharmtech`.`inventory` (drug_id, quantity, exp_date) VALUES(\'' + req.body.product + '\')', function (err, rows, fields) {
    if (err){
      logger.error("Problem inserting into inventory table");
    }
    else {
      res.status(200).send(`added ${req.body.product} to the table!`);
    }
  });
});

//add order to manufacturer
app.post('/AddRequest', (req, res) => {
  console.log(req.body.product);

  connection.query('INSERT INTO `pharmtech`.`inventory_orders` (drug_id, order_date, fulfill_date, quantity) VALUES(\'' + req.body.product + '\')', function (err, rows, fields) {
    if (err){
      logger.error("Problem inserting into inventory_orders table");
    }
    else {
      res.status(200).send(`added ${req.body.product} to the table!`);
    }
  });
});

//add perscription
app.post('/AddPerscription', (req, res) => {
  console.log(req.body.product);

  connection.query('INSERT INTO `pharmtech`.`perscription` (patient_id, drug_id, quantity, fill_date, create_date, doctor_id) VALUES(\'' + req.body.product + '\')', function (err, rows, fields) {
    if (err){
      logger.error("Problem inserting into perscription table");
    }
    else {
      res.status(200).send(`added ${req.body.product} to the table!`);
    }
  });
});

// PUT 
//update inventory quantity
router.put('/putQuantity/:drugID', async (req, res) => {
  var id = req.params.drugID;
  var quantity = req.body.quantity;

  con.query("UPDATE `pharmtech`.`inventory` SET quantity = quantity WHERE productCode = id", quantity,function (err, result, fields) {
  if (err) throw err;
  //console.log(result);
  res.end(JSON.stringify(result)); 
  });
});

//update inventory expiration date
router.put('/putExpDate/:drugID', async (req, res) => {
  var id = req.params.drugID;
  var exp_date = req.body.exp_date;

  con.query("UPDATE `pharmtech`.`inventory` SET exp_date = exp_date WHERE productCode = id", quantity,function (err, result, fields) {
  if (err) throw err;
  //console.log(result);
  res.end(JSON.stringify(result)); 
  });
});

//DELETE
//pharmacist delete inventory item
router.delete('/delete/:drugID', async (req, res) => {
  var id = req.params.drugID;
  
	con.query("DELETE FROM `pharmtech`.`inventory` WHERE drug_id = id", function (err, result, fields) {
		if (err) 
			return console.error(error.message);
		res.end(JSON.stringify(result)); 
	  });
});


//connecting the express object to listen on a particular port as defined in the config object.
app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
