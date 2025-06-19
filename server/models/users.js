const { Schema, model } = require('mongoose');


const UserSchema = new Schema( {
    name: { type: String, required: true },
    email: { type: String, required: true, set: email => String(email).toLowerCase() },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin : { type: Boolean, required: true, default: false },
    isWorker : { type: Boolean, required: true, default: false },
    workType: { type: String, required: true },
    city:{ type: String, required: true },
    street:{ type: String, required: true },
    houseNumber:{ type: Number , required: true},
    description:{ type: String , default:''},
    workerCalls: [{ type: String }],
    userCalls: [{ type: String }] 
}, { collection: 'users' });

const User = model('User', UserSchema);

module.exports = User ;
