const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require("jsonwebtoken")
const router = express.Router()

const Article = require(`../../../models/articleModel/articlesModel`)
const User = require(`../../../models/userModel/modelUser`)

router.get(`/admin/addarticle`, async (req, res, next) => {

    const kuki = req.session.ID

    try {

        let errors = []

        if (!kuki) {
            errors.push({ msg: `Please Log in first.`})
            res.render(`login`, {errors})
        } else {
            // req.flash(`msg`, `saved success`)
            jwt.verify(kuki, process.env.JWT_SECRET_KEY)
            res.render(`addarticle`)
        }
        
    } catch (err) {
        next(createError(err.status, err))
    }

})

router.post(`/admin/addarticle`, async (req, res, next) => {

    const kuki = req.session.ID

    try {

        jwt.verify(kuki, process.env.JWT_SECRET_KEY, async (err, decode) => {
        if (err) {
            console.log(err)
        } else if (decode) {
             await User.findOne({_id: decode.id}, async (err, foundUser) => {
                if (err) {
                    console.log(err)
                } else if (foundUser) {

                    let errors = []
        
                    const {name, description} = req.body
            
                    if (!name || !description) {
                        errors.push({ msg: `Please input all required fields`})
                        res.render(`addarticle`, {errors})
                    }

                    const newArticle = await new Article({
                        name,
                        description,
                        createdBy: foundUser._id
                    })

                    if (name && description) {
                        // req.flash(`message`, `Saved Successfully`)
                        await newArticle.save()
                        foundUser.articles.push(newArticle._id)
                        await foundUser.save()
                        res.redirect(`/admin/addarticle`)
                    }
                    
                }
            })
        } else {
            next(createError(err.status, err))
        }
    })

    } catch(err) {
        
        if (err.code === 11000) {
            return next(createError(err.status, `Name already exists.`))
        }

        next(createError(err.status, err))
    }


})

module.exports = router

    
