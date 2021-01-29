const express = require(`express`)
const createError = require(`http-errors`)

const router = express.Router()

router.get(`/admin/logout`, async (req, res, next) => {

    try {

        const kuki = req.session.ID = null

        res.redirect(`/admin/login`)
        
    } catch (err) {
        next(createError(err.status, err))
    }

})

module.exports = router