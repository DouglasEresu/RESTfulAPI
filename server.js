
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './Models/mongosqlConfig.js';
import {app} from './Routes/routes.js';



connectDB();


//CREATE SERVER
const port = process.env.PORT||3005;
const server = express();

// Security
server.get('/api', (req,res) => {
  res.send({
    message: 'Hi, welcome to the Ibm api'
  })
})


//read
server.get('/',function(req,res){
res.send('Welcome to the Ibm server');
});



//MIDDLEWARE 
server.use(cors());
server.use(express.json());

// Route
server.use('/', app );


// run database 
mongoose.connection.once('open', () =>{
    console.log('Database is running');

    
//run server
server.listen(port, ()=>{
    console.log(`The server is running on http://localhost:${port}/`);
});
})


