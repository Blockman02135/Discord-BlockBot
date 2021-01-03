const Discord = require('discord.js');
const client = new Discord.Client();
const MessageAttachment = Discord.MessageAttachment;
const keys = require('./keys.json');
const fs = require('fs');
const commands = require('./commands.js')

const common_prefix = 'c!';
const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=773565815080747058&permissions=8&scope=bot`;

const isAdmin = member => {
  member.hasPermission = p => {
    let _ = !1;
    member._roles.forEach(r => {
        member.guild.roles.cache.get(r).permissions.toArray().includes(p) && (_=!0);
    });
    return _;
  };
  let o = !1;
  member.id == keys["owner"] && db.devMode && (o=!0);
  member.hasPermission('ADMINISTRATOR') && (o=!0);
  member.hasPermission('MANAGE_GUILD') && (o=!0);
  member.guild.ownerID === member.id && (o=!0);
  return o;
};

function text2ms(t) {
	let list = {
    's': 1000,
		'm': 60000,
		'h': 3600000,
		'd': 86400000
  }
	return t.slice(0,t.length-1) * list[t.slice(t.length-1)];
}
function ms2text(ms) {
	let tf = n => {return n % 1 === 0 ? n : n.toFixed(1)};
  if (ms >= 86400000) {return tf(ms/86400000)+'d'}
	else if (ms >= 3600000) {return tf(ms/3600000)+'h'}
	else if (ms >= 60000) {return tf(ms/60000)+'m'}
	else if (ms >= 1000) {return tf(ms/1000)+'s'}
	return ms;
}

class Guild {
  constructor() {
    this.muteRole = null;
    this.prefix = null;
    this.nickCheck = false;
    this.badWords = [];
    this.bwa = {};
    this.autoMute = true;
    this.muteTime = text2ms('10m');
    this.warnsBeforeMute = 5;
  }
}

function nickNameChecker() {
  if (!client.guilds.cache.size) return;
  client.guilds.cache.forEach(guild => {
    if (db[guild.id].nickCheck) {
      guild.fetchAuditLogs({type: 'MEMBER_UPDATE'}).then((audit) => {
        if (!audit.entries.size) return
          let e = audit.entries.first();
          let c = e.changes[0];
          db[guild.id] && (db[guild.id].badWords.forEach(bw => {
              c.key === 'nick' && c.new !== void 0 && c.new.toLowerCase().includes(bw) && (guild.members.fetch(e.target.id).then(m=>!isAdmin(m)&&m.setNickname(c.old != void 0 ? c.old : '',`Bad Word in nickname! (${bw})`).catch(e=>{})));
          }));
      });
    };
  });
}

function sendDB(db) {
  if (typeof db == "object") {
    try {db=JSON.stringify(db)} catch(e){return [false,e]}
  };
  try {
    fs.writeFile('message.txt', db, 'utf8',_=>{});
    var a = new MessageAttachment('./message.txt',`DATABASE_${new Date()}.txt`);
    client.channels.cache.get(keys["dbFilesChannel"]).send(new Date(),a);
    return [true,'[DB] Sent! '+db];
  } catch(e) {
    return [false,e];
  };
};

module.exports = function Bot(database={},token="",cnl) {
  if (typeof database !== "object") database = JSON.parse(database);
  db = database;

  function save() {
      cnl.bulkDelete(100);
      var res = sendDB(database);
      console[res[0]?'log':'error'](res[1]);
      return res[1];
    };
    setInterval(save,60000);

  client.on('ready', () => {
    console.log(`[BOT] Logged in as ${client.user.tag}!`);
    save();

    client.guilds.cache.forEach(guild=>{!db[guild.id]&&(db[guild.id]=new Guild())});
  setInterval(()=>{
    let s = client.guilds.cache.size;
    client.user.setActivity(`on ${s} servers | ${common_prefix}help`, { type: "WATCHING"})
    });
  setInterval(nickNameChecker);
  });
  client.on("guildCreate", function(guild){
    db[guild.id] == void 0 && (db[guild.id] = new Guild());
});

client.on("guildDelete", function(guild){
    db[guild.id] && (delete db[guild.id]);
});
  client.on('message', msg => {
    var args = msg.content.slice(1).split(' ');
    if (args[0] === 'db' && msg.author.id === keys["owner"]) {
      console.log('!')
      if (!args[1]) return msg.reply('`'+JSON.stringify(database)+'`');
      if (args[1] == 'get' && args[2]) {
        return msg.reply(args[2]+': `'+database[args[2]]+'`');
      }
      if (args[1] == 'add' && args[2] && args[3]) {
        database[args[2]] = args[3];
        return msg.reply(`Added \`${args[2]}\` with value \`${args[3]}\` to database (\`${JSON.stringify(database)}\`)`);
      }
      if (args[1] == 'delete' && args[2]) {
        delete database[args[2]];
        return msg.reply(`Removed \`${args[2]}\` from database (\`${JSON.stringify(database)}\`)`);
      }
      if (args[1] == 'clear') {
        database = {};
        return msg.reply(`Cleared database (\`${JSON.stringify(database)}\`)`);
      }
      if (args[1] == 'save') {
        return msg.reply('`'+save()+'`');
      };
    };
    commands(args,msg,client,database);
  });
  try {return client.login(token);} catch(e) {return e}; // Start Bot
};
