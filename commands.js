const keys = require('./keys.json');

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
  member.id === keys["owner"] && db.devMode && (o=!0);
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

module.exports = function Commands(args,msg,client,database) {
  var db = database;
  try {
  if (msg.author.bot) return;
  if (msg.guild) {
    let member = msg.guild.members.cache.find(m=>m.id==msg.author.id);
    let cp = db[msg.guild.id].prefix ? db[msg.guild.id].prefix : undefined;
  if (msg.content.toLowerCase().startsWith(cp || common_prefix) || msg.content.startsWith(`<@!${client.user.id}>`)) {
    let args = msg.content.slice(msg.content.startsWith(`<@!${client.user.id}>`) ? 5+client.user.id.length : cp && cp.length ? cp.length : common_prefix.length).split(' ');
    let send = _msg => msg.channel.send(_msg);
    let ping = _msg => msg.reply(_msg);
    if (args[0]=='invite') return send(inviteLink)
    if (args[0]=='admin') {
      if (!isAdmin(member)) return ping(':no_entry_sign: You must have `ADMINISTRATOR` or `MANAGE_GUILD` permission or be server owner to do that!');
      return send("You're admin!")
    }
    if (args[0]=='help') {
return send({embed:{"title":"Help Menu","description":"Full commands list with examples :notepad_spiral: [Link](https://google.com/)\n```[] - Required Argument\n() - Optional Argument\n<arg1/arg2> - One of arguments\n* - Requires Admin perms```","color":31231,"footer":{"icon_url":msg.author.displayAvatarURL(),"text":"Requested by "+msg.author.tag},"author":{"name":"Created by Blockman_#0431","icon_url":"https://cdn.discordapp.com/avatars/482506786495004677/89fd8b02a3bd294a68f65eba531ec15e.png?size=1024"},"fields":[{"name":(cp||common_prefix)+"help (page)","value":"Opens help page"},{"name":(cp||common_prefix)+"prefix (<set/remove>) [new prefix] *","value":"Prefix configuration\n`"+(cp||common_prefix)+"prefix` - Current prefix\n`"+(cp||common_prefix)+"prefix set [new prefix]` - Set new prefix\n`"+(cp||common_prefix)+"prefix remove` - Sets prefix by default (`c!`)"},{"name":(cp||common_prefix)+"config *","value":"Opens configuration page"},{"name":(cp||common_prefix)+"bw (<list/add/remove>) *","value":"Bad Words configuration\n`"+(cp||common_prefix)+"bw` or `"+(cp||common_prefix)+"bw list` - Bad Words List\n`"+(cp||common_prefix)+"bw add [bad word]` - Add new bad word\n`"+(cp||common_prefix)+"bw remove [bad word]` - Remove bad word"},{"name":(cp||common_prefix)+"clear [count] or c!purge [count] *","value":"Purge messages in chnnel"}]}})
    }
    if (args[0]=='dev' && msg.author.id === keys["owner"]) {
      if (args[1]=='on') return db.devMode = !0;
      if (args[1]=='off') return db.devMode = !1;
    }
    if (args[0]=='purge'||args[0]=='clear') {
      if (!isAdmin(member)) return ping(':no_entry_sign: You must have `ADMINISTRATOR` or `MANAGE_GUILD` permission or be server owner to do that!');
      if (!args[1]) return msg.reply('You haven\'t given an amount of messages which should be deleted!');
      if (isNaN(args[1])) return msg.reply('The amount parameter isn`t a number!');
      if (args[1] > 100) return msg.reply('You can`t delete more than 100 messages at once!');
      if (args[1] < 1) return msg.reply('You have to delete at least 1 message!');
      msg.channel.messages.fetch({ limit: args[1] }).then(messages => {msg.channel.bulkDelete(messages);send(args[1]+' messages were purged!')}).then(m=>setTimeout(()=>m.delete(),3000));
    }
    if (args[0] == 'config') {
      if (!isAdmin(member)) return ping(':no_entry_sign: You must have `ADMINISTRATOR` or `MANAGE_GUILD` permission or be server owner to do that!');
      if (!args[1]) {
        return send({embed:{"title":"Configuration Menu","description":"Full commands list with examples :notepad_spiral: [Link](https://google.com/)\n```[] - Required Argument\n() - Optional Argument\n<arg1/arg2> - One of arguments```","color":16242983,"fields":[{"name":(cp||common_prefix)+"config automute","value":"Auto Mute configuration\n`"+(cp||common_prefix)+"config automute` - Current Auto Mute settings\n`"+(cp||common_prefix)+"config automute <on/off>` - Enable / Disable Auto Mute"},{"name":(cp||common_prefix)+"config muterole","value":"Mute Role configuration\n`"+(cp||common_prefix)+"config muterole` - Current Mute Role\n`"+(cp||common_prefix)+"config muterole set [role]` - Set Mute Role\n`"+(cp||common_prefix)+"config muterole create` - Automatically creates new roles & perms settings"},{"name":(cp||common_prefix)+"config mutetime","value":"Auto Mute Time configuration\n`"+(cp||common_prefix)+"config mutetime` - Current Mute Time\n`"+(cp||common_prefix)+"config mutetime [time]` - Set Mute Time\nExample: `"+(cp||common_prefix)+"config mutetime 30m`"},{"name":(cp||common_prefix)+"config warnsbeforemute","value":"Warns count configuration\n`"+(cp||common_prefix)+"config warnsbeforemute` - Current Warns Count\n`"+(cp||common_prefix)+"config warnsbeforemute [count]` - Set Warns Count"},{"name":(cp||common_prefix)+"config nickcheck","value":"Nick Name Checker configuration\n`"+(cp||common_prefix)+"config nickcheck` - Current Nick Name Checker settings\n`"+(cp||common_prefix)+"config nickcheck <on/off>` - Enable / Disable Nick Name Checker"}]}})
      }
      if (args[1]=='warnsbeforemute') {
        if (!args[2]) return send('Warns Before Mute: '+db[msg.guild.id].warnsBeforeMute);
        else if (args[2]) {
          db[msg.guild.id].warnsBeforeMute = Number(args[2]);
          return send('Warns Before Mute: '+db[msg.guild.id].warnsBeforeMute);
        }
      }
      if (args[1]=='mutetime') {
        if (!args[2]) return send('Auto Mute Time: '+ms2text(db[msg.guild.id].muteTime));
        else if (args[2]) {
          db[msg.guild.id].muteTime = text2ms(args[2]);
          return send('Auto Mute Time: '+ms2text(db[msg.guild.id].muteTime));
        }
      }
      if (args[1]=='automute') {
        if (!args[2]) return send('Auto Mute: '+(db[msg.guild.id].autoMute?'Enabled':'Disabled'));
        else if (args[2] == 'on') {
          db[msg.guild.id].autoMute = !0;
          return send('Auto Mute: Enabled');
        } else if (args[2] == 'off') {
          db[msg.guild.id].autoMute = !1;
          return send('Auto Mute: Disabled');
        }
      }
      if (args[1]=='muterole') {
        if (!args[2]) {
          if (!db[msg.guild.id].muteRole || !msg.guild.roles.cache.has(db[msg.guild.id].muteRole)) return ping('Mute role not found!\nUse `muterole create` or `muterole set [role]` to set one!');
          return send('Current Mute Role is: <@&'+db[msg.guild.id].muteRole+'>');
        } else if (args[2] == 'set') {
          let role = msg.mentions.roles.first();
          if (!role) return ping('```Usage: '+(cp || common_prefix)+'muterole set >>[role]<<```');
          db[msg.guild.id].muteRole = role.id;
          return send('New Mute Role is: <@&'+role.id+'>')
        } else if (args[2] == 'create') {
          msg.guild.roles.create({ data: { name: 'Muted', permissions: [] } }).then(role=>{
          if (!role) return ping('Something went wrong! Cant create role!')
          db[msg.guild.id].muteRole = role.id;
          msg.guild.channels.cache.forEach((channel, id) => {
              channel.createOverwrite(role, {SEND_MESSAGES: false},'Setup Mute Role');
            });
          return send('New mute role is: <@&'+role.id+'>');
        });
        }
      } else if (args[1]=='nickcheck') {
        if (!args[2]) {return send('Nick Checker: '+db[msg.guild.id].nickCheck?'`ON`':'`OFF`')}
        else if (args[2] =='on') {
          db[msg.guild.id].nickCheck = !0;
          return send('Nick Checker Enabled!')
        }
        else if (args[2] =='off') {
          db[msg.guild.id].nickCheck = !1;
          return send('Nick Checker Disabled!')
        }
      }
    }
    if (args[0] == 'bw') {
      if (!args[1] || args[1] == 'list') {
        return send('Bad Words List: '+db[msg.guild.id].badWords.join(', '));
      } else if (args[1] == 'add') {
        if (!isAdmin(member)) return ping(':no_entry_sign: You must have `ADMINISTRATOR` or `MANAGE_GUILD` permission or be server owner to do that!');
        if (!args[2]) return ping('```Usage: '+(cp || common_prefix)+'bw add >>[bad word]<<```');
        if (db[msg.guild.id].badWords.includes(args[2].toLowerCase())) return send('This word is already added!');
        db[msg.guild.id].badWords.push(args[2].toLowerCase());
        return send('Added word: `'+args[2]+'`');
      } else if (args[1] == 'remove') {
        if (!isAdmin(member)) return ping(':no_entry_sign: You must have `ADMINISTRATOR` or `MANAGE_GUILD` permission or be server owner to do that!');
        if (!args[2]) return ping('```Usage: '+(cp || common_prefix)+'bw remove >>[bad word]<<```');
        if (!db[msg.guild.id].badWords.includes(args[2].toLowerCase())) return send('This word is not added!');
        db[msg.guild.id].badWords.splice(db[msg.guild.id].badWords.indexOf(args[2].toLocaleLowerCase()),1);
        return send('Removed word: `'+args[2]+'`');
      } else if (args[1] == 'clear' && !args[2]) {
        if (!isAdmin(member)) return ping(':no_entry_sign: You must have `ADMINISTRATOR` or `MANAGE_GUILD` permission or be server owner to do that!');
        db[msg.guild.id].badWords = [];
        return send('Removed all bad words');
      }
    }
    if (args[0] == 'prefix') {
      if (!args[1]) {
        return send('My prefix on this server is `'+(cp || common_prefix)+'` or you can ping me instead of prefix!')
      } else if (args[1] == 'set') {
        if (!isAdmin(member)) return ping(':no_entry_sign: You must have `ADMINISTRATOR` or `MANAGE_GUILD` permission or be server owner to do that!');
        if (!args[2])return ping('```Usage: '+(cp || common_prefix)+'prefix set >>[new prefix]<<```');
        db[msg.guild.id].prefix = args[2];
        return send('Prefix changed to `'+args[2]+'`')
      } else if (args[1] == 'remove') {
        if (!isAdmin(member)) return ping(':no_entry_sign: You must have `ADMINISTRATOR` or `MANAGE_GUILD` permission or be server owner to do that!');
        db[msg.guild.id].prefix = null;
        return send('Prefix changed to default (`'+common_prefix+'`)')
      }
    }
  } else if (!isAdmin(member)) {
    db[msg.guild.id].badWords.forEach(bw=>{
      if (msg.content.toLowerCase().includes(bw) && db[msg.guild.id].autoMute) {
        !db[msg.guild.id].bwa[msg.author.id] && (db[msg.guild.id].bwa[msg.author.id] = 0);
        db[msg.guild.id].bwa[msg.author.id] += 1;
          msg.delete();
          msg.reply('Word: `'+bw+'` is blocked! ('+db[msg.guild.id].bwa[msg.author.id]+`/${db[msg.guild.id].warnsBeforeMute})`).then(m=>setTimeout(()=>m.delete(),3000));
          msg.author.send('Word: `'+bw+'` is blocked! ('+db[msg.guild.id].bwa[msg.author.id]+`/${db[msg.guild.id].warnsBeforeMute})`).catch(()=>{});
          if (db[msg.guild.id].bwa[msg.author.id] >= db[msg.guild.id].warnsBeforeMute) {
            db[msg.guild.id].bwa[msg.author.id] = 0;
            client.users.cache.get(member.id).send(`You were muted in **${msg.guild.name}** for ${ms2text(db[msg.guild.id].muteTime)}. Reason: Many black words are used!`)
            member.roles.add(msg.guild.roles.cache.find(r=>r.id==db[msg.guild.id].muteRole)).then(setTimeout(()=>{member.roles.remove(msg.guild.roles.cache.find(r=>r.id==db[msg.guild.id].muteRole))},db[msg.guild.id].muteTime)).catch(e=>{msg.channel.send("Cant mute <@!"+member+">, mute role not found or my role < member's heigest role!")})
          }
        }
    })
  }
  } else {
    if (msg.content.includes('invite')) return client.users.cache.get(msg.author.id).send(inviteLink).catch(()=>{});
    return client.users.cache.get(msg.author.id).send(':no_entry_sign: You must invite me to use my commands!').catch(()=>{});
  }
  } catch(e) {console.error(e)};
};
