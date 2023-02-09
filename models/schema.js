const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        auto: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['student', 'parent', 'warden', 'manager', 'admin', 'payment', 'attendance', 'hostel']
    },
    phone: {
        type: Number,
        required: function () {
            return this.type === 'student' || this.type === 'parent' || this.type === 'warden' || this.type === 'manager' || this.type === 'admin';
        },
        unique: true
    },
    name: {
        type: String,
        required: function () {
            return this.type === 'student' || this.type === 'parent' || this.type === 'warden' || this.type === 'manager' || this.type === 'admin';
        }
    },
    // email: {
    //     type: String,
    //     required: function () {
    //         return this.type === 'student' || this.type === 'parent' || this.type === 'warden' || this.type === 'manager' || this.type === 'admin';
    //     }
    // },
    password: {
        type: String,
        required: function () {
            return this.type === 'student' || this.type === 'parent' || this.type === 'warden' || this.type === 'manager' || this.type === 'admin';
        }
    },
    parent: {
        type: String,
        ref: 'schema',
    },
    child: {
        type: String,
        ref: 'schema',
    },
    hostel: {
        type: mongoose.Types.ObjectId,
        required: function () {
            return this.type === 'student'
        },
        ref: 'schema'
    },
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        present: {
            type: Boolean,
            required: true
        }
    }],
    status: {
        type: String,
        required: function () {
            return this.type === 'payment' || this.type === 'attendance';
        },
        enum: ['present', 'absent', 'paid', 'unpaid']
    },
    amount: {
        type: Number,
        required: function () {
            return this.type === 'payment';
        }
    },
    students: [{
        type: mongoose.Types.ObjectId,
        ref: 'schema'
    }]
});

module.exports = mongoose.model('schema', schema);