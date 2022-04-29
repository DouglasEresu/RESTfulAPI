import Joi from "joi";
  
const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
  .email({ tlds: { allow: ["com", "net", "org", "ug"] } })
  .lowercase()
  .required(),
  password: Joi.string()
  .min(2)
  .required()
});


  const loginSchema = Joi.object({
    email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "org", "ug"] } })
    .lowercase()
    .required(),
    password: Joi.string().min(2).required(),
  });

  export{
    signupSchema,
    loginSchema
  }