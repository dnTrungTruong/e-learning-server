//VALIDATION
const Joi = require('@hapi/joi');

exports.validation = (schema, property) => { 
    return (req, res, next) => { 
    const { error } = schema.validate(req.body); 
    const valid = error == null; 
    
    if (valid) { 
      next(); 
    } else { 
      const { details } = error; 
      const errorMessage = details.map(i => i.message).join(',');
   
     res.status(200).json({ message: errorMessage  }) } 
    } 
  } 