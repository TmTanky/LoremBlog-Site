const express = require(`express`)
const createError = require(`http-errors`)
const mongoose = require(`mongoose`)
const bcrypt = require(`bcrypt`)
const {body, validationResult} = require(`express-validator`)
const jwt = require(`jsonwebtoken`)

const saltRounds = 10
const router = express.Router()

const User = require(`../../../models/userModel/modelUser`)

router.get(`/admin/register`, async (req, res, next) => {

    const kuki = req.session.ID

    if (!kuki) {
        res.render(`register`)
    } else {
        res.redirect(`/admin/me`)
    }

})

router.post(`/admin/register`,body(`email`).isEmail().withMessage(`Email must be valid.`),body('password').isLength({ min: 5 }).withMessage(`Password must be more than 5 or more characters.`), async (req, res, next) => {

    const {name, email, password} = req.body

    try {

        let errorBox = []

        if (!name || !email || !password) {

            errorBox.push({ msg: `Please fill all required inputs`})

        return res.render(`register`, { errorBox, name, email, password })
    }

        const errors = validationResult(req);
            if (!errors.isEmpty()) {

                errorBox.push({ msg: errors.errors[0].msg })
                return res.render(`register`, { errorBox, name, email, password })
            }

        const hashPassword = await bcrypt.hash(password, saltRounds)

            const newAdmin = await new User ({
                name,
                email,
                password: hashPassword
            })

            if (!newAdmin) {
                next(createError(500, `Something happened.`))
            }

            const offAdmin = await newAdmin.save()
            const token = await jwt.sign({id: newAdmin._id}, process.env.JWT_SECRET_KEY, {expiresIn: `1d` })
            const kuki = req.session.ID = token

            
            res.redirect(`/admin/me`)
           
            
    } catch (err) {

        let errorBox = []

        if (err.name === 'MongoError' && err.code === 11000) {

            errorBox.push({ msg: `Email already in use`})

            return res.render(`register`, { errorBox, name, email, password })
          } else {
            next(err);
          }

        next(createError(err.status, err))
    }
    
})

module.exports = router
