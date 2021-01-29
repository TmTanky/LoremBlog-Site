const express = require(`express`)
const createError = require(`http-errors`)
const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

const User = require(`../../../models/userModel/modelUser`)

router.get(`/admin/login`, (req, res, next) => {

    const kuki = req.session.ID 

    if (!kuki) {
        res.render(`login`)
    } else {
        res.redirect(`/admin/me`)
    }

})

router.post(`/admin/login`, async (req, res, next) => {

    const {email, password} = req.body

    let errors = []

    if (!email || !password) {
        errors.push({ msg: `Email and Password is required to sign in.`})
        return res.render(`login`, {errors})
    }

    await User.findOne({email}, (err, foundUser) => {
        if (err) {
            next(createError(err.status, err))
        } else if (foundUser) {
            bcrypt.compare(password, foundUser.password, async (err, result) => {
                if (result) {

                    const token = await jwt.sign({id: foundUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: `1d` })
                    
                    const kuki = req.session.ID = token

                    res.redirect(`/admin/me`)
                } else {
                    errors.push({ msg: `Invalid Email or Password.`})
                    return res.render(`login`, {errors})
                }
            })
        } else {
            errors.push({ msg: `User not exist.`})
            return res.render(`login`, {errors})
        }
    })
    
})

module.exports = router