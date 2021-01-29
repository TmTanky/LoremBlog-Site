const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

const User = require(`../../../models/userModel/modelUser`)

router.get(`/admin/me/editprofile`, async (req, res, next) => {

    const kuki = req.session.ID
    
    try {

        let errors = []

        if (!kuki) {
            errors.push({ msg: `Please Log in first.`})
            res.render(`login`, {errors})
        } else {
            jwt.verify(kuki, process.env.JWT_SECRET_KEY, async (err, decode) => {
                if (err) {
                    console.log(err)
                } else if (decode) {

                    await User.findOne({_id: decode.id}, async (err, foundAdmin) => {
                        if (err) {
                            console.log(err)
                        } else if (foundAdmin) {
                            const pangalan = foundAdmin.name
                            res.render(`editmyprofile`, {namers: pangalan})
                        }
                    })

                }
            })
        }
        
    } catch (err) {
        next(createError(err.status, err))
    }

})

router.post(`/admin/me/editprofile`, async (req, res, next) => {

    const kuki = req.session.ID

    const {name} = req.body

    try {

        let errors = []

        jwt.verify(kuki, process.env.JWT_SECRET_KEY, async (err, decode) => {
            if (err) {
                console.log(err)
            } else if (decode) {
                User.findOne({_id: decode.id}, async (err, foundAdmin) => {
                    if (err) {
                        console.log(err)
                    } else if (foundAdmin) {
                        User.findOneAndUpdate({name: foundAdmin.name}, {name}, (err, data) => {
                            if (err) {
                                console.log(err)
                            } else {
                                res.redirect(`/admin/me/editprofile`)
                            }
                        })
                    }
                })
            }
            else {
                next(createError(err.status, err))
            }
        })

        
        
    } catch (err) {
        next(createError(err.status, err))
    }
    
})

module.exports = router