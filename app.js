require('dotenv').config()
const express = require(`express`)
const bodyParser = require(`body-parser`)
const mongoose = require(`mongoose`)
const createError = require(`http-errors`)
const ejs = require(`ejs`)
const cookieSession = require(`cookie-session`)

const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(`public`))
app.set(`view engine`, `ejs`)
app.set('trust proxy', 1) 
app.use(cookieSession({
    name: 'auth',
    keys: [process.env.KEY_1, process.env.KEY_2]
  }))

// renderRouters 

const root = require(`./routes/rootview/root/root`)
const login = require(`./routes/rootview/login/login`)
const addArticle = require(`./routes/rootview/addArticleAdmin/addArticle`)
const previewArticle = require(`./routes/rootview/articleoverview/articlepreview`)
const logout = require(`./routes/rootview/logout/logout`)
const register = require(`./routes/rootview/register/register`)
const me = require(`./routes/rootview/me/me`)
const editProfile = require(`./routes/rootview/editprofile/editprofile`)

// connect to DB
mongoose.connect(process.env.DB,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})

// renders

app.use(login)
app.use(addArticle)
app.use(root)
app.use(previewArticle)
app.use(logout)
app.use(register)
app.use(me)
app.use(editProfile)

app.use((req, res, next) => {
    next(createError(404, `URL not found`))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status,
            message: err.message,
        }
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running, Congratz!`)
})