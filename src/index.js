/* for .env */
require("dotenv").config()

/* Package requires */
const {Client} = require('discord.js')

/* Client */
const client = new Client({intents: 32767})

/* Config Files (public) */
const config = global.config = require('./config.json')

//Ready Event
client.on('ready', async()=>{
    console.log(`${client.user.username} is online.`)
})

//MessageCreate
client.on('messageCreate',async(message)=>{
    const prefix = config.prefix
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase()
    if(!message.content.toLowerCase().startsWith(prefix)) return;
    if(!message.guild.me.permissions.has('SEND_MESSAGES')) return;
    switch(command) {
        default:
            return
    }
})

client.login(process.env.token)