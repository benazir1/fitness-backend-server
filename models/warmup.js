const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const warmupSchema = new Schema({
  warmup: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: String, required: true },
}, {
  timestamps: true,
});

const Warmup= mongoose.model('Warmup', warmupSchema);

module.exports = Warmup;