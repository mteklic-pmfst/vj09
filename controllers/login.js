const Korisnik=require('../models/korisnik')
const loginRouter=require('express').Router()
const bcrypc=require('bcrypt')
const jwt=require('jsonwebtoken')
const { request } = require('express')
const { modelNames } = require('mongoose')


loginRouter.post('/',async(req,res)=>{

    const podaci=req.body //username i pass
    const korisnik=await Korisnik.findOne({username:podaci.username})


    const passDobar=korisnik === null
    ? false 
    : await bcrypc.compare(podaci.pass,korisnik.passHash)

    if(!(korisnik&&passDobar)){
        res.status(401).json({error:'Neispravna lozinka ili username'})
    } //Korisnik se nije  uspio prijaviti


    //Sve OK

    const userToken={
        username:korisnik.username,
        id:korisnik._id
    }

    const token=jwt.sign(userToken,process.env.SECRET)

    res.status(200).send({token,username:korisnik.username,ime:korisnik.ime})
})

module.exports=loginRouter;
