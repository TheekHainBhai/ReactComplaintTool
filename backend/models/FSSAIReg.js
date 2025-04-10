const mongoose = require('mongoose');

const fssaiRegSchema = new mongoose.Schema({
  business: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  fssaiNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{14}$/.test(v);
      },
      message: props => `${props.value} is not a valid FSSAI number! Must be exactly 14 digits.`
    },
    sparse: true,
    unique: true
  },
  certificateFileName: {
    type: String,
    required: true
  },
  certificatePath: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  verified: {
    type: Boolean,
    default: false
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  verificationDate: {
    type: Date
  },
  remarks: {
    type: String,
    trim: true
  }
});

// Add indexes
fssaiRegSchema.index({ email: 1 });
fssaiRegSchema.index({ fssaiNumber: 1 });
fssaiRegSchema.index({ status: 1 });

module.exports = mongoose.model('FSSAIReg', fssaiRegSchema);