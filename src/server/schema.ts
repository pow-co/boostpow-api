
const Joi = require('joi')

export const Job = Joi.object({
  id: Joi.number(),
  content: Joi.string().required(),
  difficulty: Joi.number().required(),
  category: Joi.string().required(),
  tag: Joi.string().required(),
  additionalData: Joi.string().required(),
  userNonce: Joi.string().required(),
  vout: Joi.number().required(),
  value: Joi.number().required(),
  timestamp: Joi.date().required(),
  spent: Joi.boolean().required(),
  script: Joi.string().required(),
  spent_txid: Joi.string().optional(),
  spent_vout: Joi.number().optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional()
}).label('Job')

