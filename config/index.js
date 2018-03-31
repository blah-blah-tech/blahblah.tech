const Joi = require('joi')

require('dotenv').config()

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'stage', 'production'])
    .default('development'),
  PORT: Joi.number()
    .default(3000),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false),
    }),
  MONGO_URI: Joi.string().required()
    .description('MongoDB URI'),
}).unknown().required()

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  mongo: {
    uri: envVars.MONGO_URI,
  },
}

exports.default = config
