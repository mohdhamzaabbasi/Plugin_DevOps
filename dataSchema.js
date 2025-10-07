const Joi = require('joi');

// Schema for a step (flow node)
const stepSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  execNode: Joi.string().allow('', null).optional(),
  status: Joi.string().required(),
  error: Joi.any().optional(),
  parameterDescription: Joi.string().allow('', null).optional(),
  startTimeMillis: Joi.number().required(),
  durationMillis: Joi.number().required(),
  pauseDurationMillis: Joi.number().required(),
  parentNodes: Joi.array().items(Joi.string()).allow(null).optional()
});

// Schema for the parent stage of the step
const stageSchema = Joi.object({
  stageId: Joi.string().required(),
  stageName: Joi.string().required(),
  execNode: Joi.string().allow('', null).optional(),
  status: Joi.string().required(),
  error: Joi.any().optional(),
  startTimeMillis: Joi.number().required(),
  durationMillis: Joi.number().required(),
  pauseDurationMillis: Joi.number().required()
});

// Schema for time in queue metrics
const timeInQueueMetricsSchema = Joi.object({
  blockedDurationMillis: Joi.number().required(),
  blockedTimeMillis: Joi.number().required(),
  buildableDurationMillis: Joi.number().required(),
  buildableTimeMillis: Joi.number().required(),
  buildingDurationMillis: Joi.number().required(),
  executingTimeMillis: Joi.number().required(),
  executorUtilization: Joi.number().required(),
  subTaskCount: Joi.number().required(),
  waitingDurationMillis: Joi.number().required(),
  waitingTimeMillis: Joi.number().required()
});

// Main schema for single step document
const stepDocumentSchema = Joi.object({
  causes: Joi.array().items(Joi.object()).required(),
  timeInQueueMetrics: timeInQueueMetricsSchema.required(),
  artifacts: Joi.array().items(Joi.object()).required(),
  building: Joi.boolean().required(),
  description: Joi.string().allow('', null).optional(),
  displayName: Joi.string().required(),
  duration: Joi.number().required(),
  estimatedDuration: Joi.number().required(),
  executor: Joi.object().required(),
  fullDisplayName: Joi.string().required(),
  id: Joi.string().required(),
  keepLog: Joi.boolean().required(),
  number: Joi.number().required(),
  queueId: Joi.number().required(),
  result: Joi.string().allow('', null).optional(),
  timestamp: Joi.number().required(),
  url: Joi.string().uri().required(),
  changeSets: Joi.array().items(Joi.object()).required(),
  culprits: Joi.array().items(Joi.object()).required(),
  inProgress: Joi.boolean().required(),
  nextBuild: Joi.object().allow(null).optional(),
  previousBuild: Joi.object().allow(null).optional(),

  stage: stageSchema.required(),
  step: stepSchema.required()
});

module.exports = stepDocumentSchema;

