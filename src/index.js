require('dotenv').config()
//for env

const {Client} = require('discord.js')

const client = new Client({intents: 32767})

//Keep config files which are allowed to public like prefix in config.json
const config = global.config = require('../config.json')

//Ready Event
client.on('ready', async()=>{
    console.log(`${client.user.username} is online.`)
})

//MessageCreate
client.on('messageCreate',async(message)=>{
    const prefix = config.prefix
    //handler i guess, we will discuss it later
        
})


client.login(process.env.TOKEN)