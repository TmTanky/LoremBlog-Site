const mongoose = require(`mongoose`)

const articlesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    dateCreatedAt: {
        type: Date,
        default: new Date
    },
    createdBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: `user`
        }
    ]
})

// articlesSchema.pre(/^find/, function(next) {
//     this.populate({
//         path: `user`
//     })
//     next()
// })

const ArticleMan = new mongoose.model(`article`, articlesSchema)

module.exports = ArticleMan