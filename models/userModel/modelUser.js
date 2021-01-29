const mongoose = require(`mongoose`)
const createError = require(`http-errors`)

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: true
    },
    articles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: `article`
        }
    ]
})

// userSchema.pre(/^find/, function(next) {
//     this.populate({
//         path: `article`
//     })
//     next()
// })

// userSchema.post('save', function(err, doc, next) {
//     if (err.name === 'MongoError' && err.code === 11000) {
//       return next(createError(400, `Email already in use.`))
//     } else {
//       return next(err);
//     }
// })


const UsersMan = new mongoose.model(`user`, userSchema)

module.exports = UsersMan

