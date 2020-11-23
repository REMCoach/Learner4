const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const fileUpload = require('express-fileupload');
var fs = require("fs");
var path = require('path');
const app = express();
// Initialize server

app.use(express.static('Files'));
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
  
const { json } = require("body-parser");
// Database connection

const {
    DB_HOST,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    DB_TIMEZONE
  } = require("../src/config");

  
  let db_config = {
    
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    timezone: DB_TIMEZONE,
  
  };


//db connection

var db =mysql.createConnection(db_config);

db.connect()
//console.log(db);
db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });

app.get('/show1',(req,res)=>{
    console.log("calling show");
 
  var sq = "select * from task2";
  // var sq = "select * from task2 ";
  db.query(sq,(err,rows,fields)=>{
   
      if(!err){
        
        res.send(JSON.stringify(rows));
      //  console.log(rows)

        }
        else{
          
        }
    })
  })

app.post("/submit",(req,res)=>{
    console.log("calling submit");
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const dob = req.body.dob;
    const size = req.body.size;
    const python = req.body.python;
    const react = req.body.react;
    const c = req.body.c;
    const option = req.body.option;
    const uname = req.body.uname;
    const password = req.body.password;
    const checked = req.body.checked;
    const file1 = req.body.file1;
    const file2 = req.body.file2;
    const file3 = req.body.file3;
    const file4 = req.body.file4;
   // const total_sal = req.body.total_sal;
  
    
  
   console.log(uname);
    const query1 = "insert into task2 (firstname,lastname,dob,size,python,react,c,option1,username,password,checked,file1,file2,file3,crop) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(query1,
        [firstname,lastname,dob,size,python,react,c,option,uname,password,checked,file1,file2,file3,file4]
      ,(err,result)=>{
    console.log(err+"error");
    
    if (err) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      res.send({
        "code":200,
        "success":"sucess"
      })
    }
    
    })
    
    // res.send("success");       
  });
app.post('/download', (req, res) => {
  // const file = req.body.file1
  // console.log(file)
  res.download('./src/public/1.jpg');
})

app.post('/upload', (req, res) => {

    console.log("call");
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
        // accessing the file
    const myFile = req.files.file;
  
    console.log(myFile);
 // console.log(req);


    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err,result) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({name: myFile.name, 
          path: `http://localhost:4000/public/${myFile.name}`});
    });
})

app.post("/uslog",(req,res)=>{

  console.log("calling login");
  var email= req.body.email;
  var password = req.body.password;
  console.log(email);
  db.query('SELECT * FROM task2 WHERE username = (?)',[email], async function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      if(results.length >0){
        // console.log(password);
        // console.log( results[0].password);
        // const comparision = await bcrypt.compare(password, results[0].password);
     // console.log(results[0].crop);
        console.log(password === results[0].password);

        if(password === results[0].password){
            res.send({
              "code":200,
              "success":"login sucessfull",
            "results": results[0]
            }
            )
        }
        else{
          
          res.send({
               "code":204,
               "success":"Email and password does not match",
               
          })
        }
      }
      else{
        res.send({
          "code":206,
          "success":"Email does not exits"
            });
      }
    }
    });
  
});

app.post("/adminlog",(req,res)=>{

  console.log("calling login");
  var email= req.body.email;
  var password = req.body.password;
  console.log(email);
  db.query('SELECT * FROM admin WHERE username = (?)',[email], async function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      if(results.length >0){
        
        console.log(password === results[0].password);
        if(password === results[0].password){
            res.send({
              "code":200,
              "success":"login sucessfull",
              "data1" :results[0]
            }
            )
        }
        else{
          
          res.send({
               "code":204,
               "success":"Email and password does not match",
               
          })
        }
      }
      else{
        res.send({
          "code":206,
          "success":"Email does not exits"
            });
      }
    }
    });
  
});

app.post('/updateadmin', (req,res)=>{
  console.log("calling update admin")
  const full = req.body.full;
  const user = req.body.user;
  const pass = req.body.pass;
  const user1 = req.body.user1;
 console.log(user1);
  var qq = "UPDATE admin SET fullname = ? , username = ?, password= ? WHERE username= ? ";
  db.query(qq,[full,user,pass,user1],(err,result)=>{
    if("!err"){res.send("Successfully Updated") ;}
    else{res.send(err)}
    
  })
})

app.post('/viewuser',(req,res)=>{
  const user = req.body.un;
  var da = "select * from task2 where username = ?";
  db.query(da,[user],(err,result)=>{
    if(!err){ res.send(result[0]);}
  })
})

app.post('/updateuser', (req,res)=>{
  console.log("calling update user admin")
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const dob = req.body.dob;
  const size = req.body.size;
  const python = req.body.python;
  const react = req.body.react;
  const c = req.body.c;
  const option = req.body.option;
  const uname = req.body.uname;
  const password = req.body.password;
  const checked = req.body.checked;
  const user1 = req.body.username
 console.log(user1);
  var qq = "UPDATE task2 SET firstname= ? ,lastname= ?,dob= ?,size= ?,python= ?,react= ?,c= ?,option1= ?,username= ?,password= ?,checked= ? WHERE username= ? ";
  db.query(qq, [firstname,lastname,dob,size,python,react,c,option,uname,password,checked,user1],(err,result)=>{
    if("!err"){res.send("Successfully Updated") ;}
    else{res.send(err)}
    
  })
})


// __dirname will use the current path from where you run this file 
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '/public')));


module.exports = app;
