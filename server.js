const { request } = require('express');
const express = require('express')
require('dotenv').config();
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')

const app = express()

mongoose.connect(process.env.MONGO_CLIENT,{
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({
    extended: false,
}))

app.get('/',async (req,res)=>{
    const shortUrls = await ShortUrl.find()
    res.render('index', {shortUrls : shortUrls})
})

app.get('/:id',async (req,res) => {
    const url = await ShortUrl.findOne({ short : req.params.id})
    if(url === null)return res.sendStatus(404)
    url.clicks++;
    url.save()
    res.redirect(url.full)
})

app.post('/shortURL',async (req,res)=>{
    if(ShortUrl.findOne({ full : req.body.fullUrl}).full == req.body.fullUrl)
        return
    await ShortUrl.create({ full: req.body.fullUrl})
    res.redirect('/')
})

app.listen(process.env.PORT || 3000)