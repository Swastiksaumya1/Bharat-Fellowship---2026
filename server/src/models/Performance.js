import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
  district: { 
    type: String, 
    required: true,
    index: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  data: { 
    type: Object, 
    required: true 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Compound index for faster queries
performanceSchema.index({ state: 1, district: 1 });

export default mongoose.model("Performance", performanceSchema);

