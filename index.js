const { Client } = require('discord.js');
const client = new Client();
const fetch = require('node-fetch');
const keys = require('./keys.json');
const Bot = require('./bot.js');

var database = {};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  var cnl = client.channels.cache.get(keys["dbFilesChannel"]);
  cnl.messages.fetch(cnl.lastMessageID).then(m=>m.attachments.size&&(fetch(m.attachments.first().attachment).then(_=>_.text()).then(db=>{
    database = db;
    Bot(database,process.env.TOKEN,cnl);
    console.log(database);
  })));
});

client.login(process.env.TOKEN);
