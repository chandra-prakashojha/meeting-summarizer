const Joi = require("joi");

const createMeetingSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
});

module.exports = {
  createMeetingSchema,
};