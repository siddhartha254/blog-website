const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    bookmarks: [{type:Schema.Types.ObjectId, ref: 'Post', unique:true}],
});

UserSchema.pre('save', function (next) {
    this.bookmarks = Array.from(new Set(this.bookmarks.map(String))); // Remove duplicate bookmarks
    next();
  });

const UserModel = model('User', UserSchema);


module.exports = UserModel;