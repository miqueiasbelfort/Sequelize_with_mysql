// IMPORTING THE MODULES
const express = require('express')
const exphbs = require("express-handlebars")

//DATABASE WITH SEQUELIZE CONFIG
const conn = require('./db/comn')
const User = require('./models/User')
const Address = require('./models/Address')

const app = express()

//CONFIG OF THE HANDLEBARS
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//CONFIG FOR TO GET THE BODY
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

// CONFIG OF THE CSS
app.use(express.static('public'))

//ROUTER
app.get('/users/create', (req,res) => {
    res.render('adduser')
})

app.post('/users/create', async (req,res) => {
    const name = req.body.name
    const occupation = req.body.occupation
    let newsletter = req.body.newsletter //se estiver cheked vai vir "on"

    if(newsletter === 'on'){
        newsletter = true
    } else {
        newsletter = false
    }

    console.log(req.body)

    await User.create({name, occupation, newsletter})

    res.redirect('/')
})

app.get('/users/:id' , async (req,res) => {
    const id = req.params.id

    const user = await User.findOne({raw: true, where: {id: id}})

    res.render('usersview', { user })
})

app.post('/users/delete/:id', async (req,res) => {
    const id = req.params.id
    await User.destroy({where: { id: id } })
    res.redirect('/')
})

app.get('/users/edit/:id', async (req,res) => {
    const id = req.params.id


   try{
        const user = await User.findOne({ include: Address, where: {id:id}})
        res.render('useredit', { user: user.get({ plain: true }) })
   } catch(err){
       console.log(err)
   }
    
})

app.post('/users/update', async (req,res) => {
    const name = req.body.name
    const id = req.body.id
    const occupation = req.body.occupation
    let newsletter = req.body.newsletter

    if(newsletter === 'on'){
        newsletter = true
    } else {
        newsletter = false
    }

    const userData = {
        id,
        name,
        occupation,
        newsletter
    }

    await User.update(userData, {where : {id: id}})

    res.redirect('/')
})

//Address routers
app.post('/address/create', async (req,res) => {
    const UserId = req.body.UserId
    const street = req.body.street
    const number = req.body.number
    const city = req.body.city

    const address = {
        UserId,
        street,
        number,
        city
    }

    await Address.create(address)
    res.redirect(`/users/edit/${UserId}`)
})

app.post('/address/delete', async (req,res) => {
    const UserId = req.body.UserId
    const id = req.body.id

    await Address.destroy({
      where: {id: id}  
    })

    res.redirect(`/users/edit/${UserId}`)
})

// MAIN ROUTER
app.get('/', async (req, res) => {

    const users = await User.findAll({raw: true})
    //console.log(users)

    res.render('home', {users: users})
})

conn
    .sync()
    //.sync({force: true})
    .then(() => {app.listen(3000)})
    .catch(err => console.log(err))