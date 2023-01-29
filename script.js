
const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
let app = express();


//Configuring express server
app.use(bodyparser.json());

//MySQL details
let mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Traderzik1231983',
    database: 'learners',
    multipleStatements: true
});

mysqlConnection.connect((err)=> {
    if(!err)
    console.log("Connection Established Successfully");
    else 
    console.log('Connection Failed!'+ JSON.stringify(err, undefined,2));
});

//Establish the server connection
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log(`Listening on port ${port}..` ));

//There was displayed the error
//error: 1049, "Unknown database 'learner'";
//The issue was solved by "CREATE DATABASE learner" in mysql command line, creating database locally;


//Creating GET Router to fetch all the learner details from the MySQL Database

app.get('/learners', (req, res)=>{
    mysqlConnection.query('SELECT * FROM learnerdetails', (err, rows, fields)=> {
        if(!err)
        res.send(rows);
        else 
        console.log(err);
    })
});

//Router to GET specific learner from the MySQL database

app.get('/learners/:id', (req, res)=>{
    mysqlConnection.query('SELECT * FROM learnerdetails WHERE learner_id = ?', [req.params.id], (err, rows, fields)=> {
        if(!err)
        res.send(rows);
        else 
        console.log(err);
    })
});

//Router to INSERT/POST a learner's detail



app.post('/learners', (req, res)=> {
    let learner = req.body;
    let sql = `INSERT INTO learnerdetails (learner_id,learner_name,learner_email,course_id) VALUES (?, ?, ?, ?)`;
   
    mysqlConnection.query(sql, [learner.learner_id, learner.learner_name, learner.learner_email, learner.course_id], (err, result) => {
    
        if (err) throw err;
        else
        res.send('New Learner ID : '+ result.insertId);
       

    })

}); 


//Router to UPDATE a learner's detail

app.put('/learners', (req, res)=> {
    let learner = req.body;
    let sql = `UPDATE learnerdetails SET @learner_name=? WHERE @learner_id= ?`;
   
    mysqlConnection.query(sql, [learner.learner_name,learner.learner_id], (err, result) => {
    
        if (err) throw err;
        else
        res.send('Learner Details have been updated successfully');
       

    })

}); 

//Router to DELETE a learner's detail

app.delete('/learners/:id', (req, res)=>{
    mysqlConnection.query("DELETE FROM learnerdetails WHERE learner_id = ?", [req.params.id], (err, rows, fields)=>{
        if(!err)
        res.send("Learner's Record has been deleted successfully.");
        else
        console.log(err);
    })
})