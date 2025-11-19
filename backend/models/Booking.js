const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  monthlyRent: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  payments: [{
    amount: {
      type: Number,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    paidDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    },
    month: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    transactionId: String,
    paymentMethod: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create monthly payment records
bookingSchema.methods.generateMonthlyPayments = function() {
  const payments = [];
  const start = new Date(this.startDate);
  const end = this.endDate ? new Date(this.endDate) : new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
  
  let currentDate = new Date(start);
  
  while (currentDate <= end) {
    payments.push({
      amount: this.monthlyRent,
      dueDate: new Date(currentDate),
      status: 'pending',
      month: currentDate.toLocaleString('default', { month: 'long' }),
      year: currentDate.getFullYear()
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return payments;
};

module.exports = mongoose.model('Booking', bookingSchema);