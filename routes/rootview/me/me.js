const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)
const router = express.Router()

const User = require(`../../../models/userModel/modelUser`)
const Article = require(`../../../models/articleModel/articlesModel`)

router.get(`/admin/me`, async (req, res, next) => {

    const kuki = req.session.ID

    let errors = []

    try {

        if (!kuki) {
            errors.push({ msg: `Please Log in first.`})
            res.render(`login`, {errors})
        } else {
            // req.flash(`msg`, `saved success`)
            jwt.verify(kuki, process.env.JWT_SECRET_KEY, async (err, decode) => {
                if (err) {
                    next(createError(err.status, err))
                } else if (decode)

                await User.findOne({_id: decode.id}, (err, foundAdmin) => {

                    const adminName = foundAdmin.name
                    const firstWordName = adminName.split(" ")[0]

                    res.render(`me`, {adminName: firstWordName})

                })

            })
        }
        
    } catch (err) {
        next(createError(err.status, err))
    }
    
})

module.exports = router