import express from 'express';
import {UserModel} from '../Models/user.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import joi from 'joi';
import { signupSchema,loginSchema } from "../utils/validation.js";
// import auth from '../Utils/auth.js';
import { QuestionModel } from '../Models/questions.js';
import { AnswerModel } from '../Models/ans.js';
export const app = express.Router();


// SIGNUP
app.post("/signup",  async (req, res) => {
    
  try {
      const result  = await signupSchema.validateAsync(req.body);
      // console.log(result);

    let email = await UserModel.findOne({ email: result.email });
    if (email)
      return res.status(400).json({
        message:`User with email: ${result.email} already exists`
      });

    const salt = await bcrypt.genSalt(10);
    const user = await new UserModel({
      name: result.name,
      email: result.email,
      password: await bcrypt.hash(result.password, salt),
    });

    const savedUser = await user.save();
    if (!savedUser) throw Error('Something went wrong saving the user');
    // res.status(201).send(user);

    //TOken
    const token = jwt.sign(user.toJSON(), "privateKey");
    if (!token) throw Error('Could not sign the token');
    
    res.status(200).json({
      accessToken: token,
      user: user,
      message:`Welcome ${user.name}`
    });


  } catch (error) {
    res.status(500).json({
        error:error
  })
  }
});

//   LOGIN
app.post('/login', async (req, res) => {
try {
  const result  = await loginSchema.validateAsync(req.body);
// console.log(result)
  const user = await UserModel.findOne({ email: result.email });
  if (!user || !(await bcrypt.compare(result.password, user.password))) {
    return res.status(400).json(`Invalid email or password`);
  }
  
  //Token
  const token = jwt.sign(user.toJSON(), "privateKey");//put private key in a .env
  if (!token) throw Error('Could not sign the token');
  
  res.status(200).json({
    accessToken: token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    message:`Welcome ${user.name}`
  });

} catch (error) {
  res.status(422).json({
      error:error
})
}
});




// GET USERS
app.get('/', (req,res)=>{
  UserModel.find()
.sort({date:-1})
.then(users => res.json(users));
});

app.get('/users',(req,res)=>{
 UserModel.find()
.then(users => res.json(users))
.catch((err) => {
  res.status(500).json({
    message:`server error:${err}`
  })
})
});




// POST USER
  app.post('/user', (req,res)=>{
    const newUser = new UserModel({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password
    });
    newUser
    .save()
    .then(user => res.json(user))
   .catch(err=> res.status(404).json({ Success:false}));
     });

     



    //  UPDATE USER USING PARAMS
    app.put("/user/:id", (req, res) => {
      const id = req.params.id;
      UserModel.findOne({_id: id })
       .then(userId =>{
         if (!userId) {
        return res.status(404).json(`no such id ${id}`);
      }})

      UserModel.updateOne({ _id: id }, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
        })
        .then((userId) => {
          if (!userId) {
            return res.status(404).json(`no such id ${id}`);
          }
        })
      .then(() => {
       UserModel.findOne({_id: id })
       .then(result =>{res.status(200).json(result)})
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err,
          message:`Id is wrong`
        });
      });
    });


// DELETE USER BY ID
app.delete('/user/:id',(req,res)=>{
  UserModel.findById(req.params.id)
   .then(user =>user.remove()
   .then(()=> res.json({message:'User delete successful'})))
   .catch(err=> res.status(404).json({ message: `delete failed${err}`}));
    });
    
    










    //VIEW ALL QUESTIONS
    app.get('/questions', (req,res)=>{
      QuestionModel.find()
    .sort({date:-1})
    .then(questions => res.json(questions)).catch(err => res.status(500).send(err))
    });
    
    // VIEW QNS USING USER id
    app.get('/questions/:id',(req,res)=>{ 
      const id = req.params.id;
      UserModel.findOne({_id: id })
       .then(userId =>{
         if (!userId) {
        return res.status(404).json(`no such id ${id}`);
      }
    })
      // .then(() => {
      //   UserModel.findOne({_id: id })
      //   .then(result =>{res.status(200).json(result)})
      //  })
       .catch(err => {
         console.log(err);
         res.status(500).json({
           error: err,
           message:`Id is wrong`
         });
       });
    QuestionModel.findById(req.params.id)
    .then(questions => res.json(questions))
    .catch((err) => {
      res.status(500).json({
        message:`server error:${err}`
      })
    })
    });


    // POST QNS USING USER id
      app.post('/question/:id', (req,res)=>{
        const id = req.params.id;
      UserModel.findOne({_id: id })
       .then(userId =>{
         if (!userId) {
        return res.status(404).json(`no such id ${id}`);
      }
    })
      .then(() => {
        UserModel.findOne({_id: id })
        .then(result =>{res.status(200).json(result)})
       })
       .catch(err => {
         console.log(err);
         res.status(500).json({
           error: err,
           message:`Id is wrong`
         });
       });
        const newQuestion = new   QuestionModel({
          
            id:req.params.id ,
            name: req.body.name,
            question:req.body.question
        });   
      newQuestion
    .save()
    .then(question => res.json(question))
   .catch(err=> res.status(404).json({ message:`question err:${err}`}));
     });
  
    // DELETE QUESTIONS
    app.delete('/question/:id',(req,res)=>{
      QuestionModel.findById(req.params.id)
       .then(question =>question.remove()
       .then(()=> res.json({message:'question delete successful'})))
       .catch(err=> res.status(404).json({ message: `delete failed${err}`}));
        });
     





        


        //VIEW ALL ANSWERS   
    app.get('/answers', (req,res)=>{
      AnswerModel.find()
    .sort({date:-1})
    .then(answers => res.json(answers)).catch(err => res.status(500).send(err))
    });
    

    // VIEW ANSWERS TO QUESTIONS BY QN id
    app.get('/answers/:id',(req,res)=>{
      const id = req.params.id;
      QuestionModel.findOne({_id: id })
       .then(questionId =>{
         if (!questionId) {
        return res.status(404).json(`no such id ${id}`);
      }
    })
      // .then(() => {
      //   QuestionModel.findOne({_id: id })
      //   .then(result =>{res.status(200).json(result)})
      //  })
       .catch(err => {
         console.log(err);
         res.status(500).json({
           error: err,
           message:`Id is wrong`
         });
       });
    AnswerModel.findById(req.params.id)
    .then(questions=> res.json(questions))
    .then(answers=> res.json(answers))
    .catch((err) => {
      res.status(500).json({
        message:`server error:${err}`
      })
    })
    });

    // PoST ANSWERS USING QN id
      app.post('/answers/:id', (req,res)=>{
        const id = req.params.id;
      QuestionModel.findOne({_id: id })
       .then(questionId =>{
         if (!questionId) {
        return res.status(404).json(`no such id ${id}`);
      }
    })
      .then(() => {
        QuestionModel.findOne({_id: id })
        .then(result =>{res.status(200).json(result)})
       })
       .catch(err => {
         console.log(err);
         res.status(500).json({
           error: err,
           message:`Id is wrong`
         });
       });
        const newAnswer = new AnswerModel({
          
            id:req.params.id ,
            name:req.body.name,
            answer:req.body.answer
        });   
      newAnswer
    .save()
    .then(answer => res.json(answer))
   .catch(err=> res.status(404).json({ message:`question err:${err}`}));
     });