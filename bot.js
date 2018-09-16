const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const jimp = require('jimp')
const Jimp = require('Jimp')
const chalk = require('chalk');
const moment = require('moment');
const ayarlar = require('./ayarlar.json')
require('./util/eventLoader')(client);

var prefix = "!"; 

const log = message => {
  console.log(`[${moment().format('-')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.on("message", async message => {
    let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
    if(sayac[message.guild.id]) {
        if(sayac[message.guild.id].sayi <= message.guild.members.size) {
            const embed = new Discord.RichEmbed()
                .setDescription(`Tebrikler ${message.guild.name}! Başarıyla ${sayac[message.guild.id].sayi} kullanıcıya ulaştık! Sayaç sıfırlandı!`)
                .setColor(ayarlar.renk)
                .setTimestamp()
            message.channel.send({embed})
            delete sayac[message.guild.id].sayi;
            delete sayac[message.guild.id];
            fs.writeFile("./ayarlar/sayac.json", JSON.stringify(sayac), (err) => {
                console.log(err)
            })
        }
    }
})



//Resimli Profil Level//

let points = JSON.parse(fs.readFileSync('./xp.json', 'utf8'));

var f = [];
function factorial (n) {
  if (n == 0 || n == 1)
    return 1;
  if (f[n] > 0)
    return f[n];
  return f[n] = factorial(n-1) * n;
};
function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

client.on("message", async message => {
    if (message.channel.type === "dm") return;

  if (message.author.bot) return;

  var user = message.mentions.users.first() || message.author;
  if (!message.guild) user = message.author;

  if (!points[user.id]) points[user.id] = {
    points: 0,
    level: 0,
  };

  let userData = points[user.id];
  userData.points++;

  let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
  if (curLevel > userData.level) {
    userData.level = curLevel;
    	message.channel.startTyping();
        var user = message.mentions.users.first() || message.author;
let Kullanicimiz = message.author.avatarURL
        var imagetobase = `https://i.hizliresim.com/lZR1Zr.png`;
        Jimp.read(Kullanicimiz, function (err, profilekafa) {
            if (err) throw err;
            profilekafa.quality(60)
                      .resize(60, 58)
                      .write("profilkafa.jpg");
            Jimp.read(imagetobase, function (err, mydude) {
                if (err) throw err;
                Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(function (font) {
                    mydude.quality(60)
                    mydude.print(font, 47, 100, `${userData.level}`)            
                    mydude.composite( profilekafa, 28, 9 )
                    mydude.write("yenilevel.jpg")
                    mydude.getBuffer(`image/jpeg`, (err, buf) => {
                        if (err) return err;
                        message.channel.send({files: [{attachment: buf, name: `croxy-level.jpg`}] })
                        message.channel.stopTyping();
                    })
                })
            })}
        )};
fs.writeFile('./xp.json', JSON.stringify(points), (err) => {
    if (err) console.error(err)
  })
  if (message.content.toLowerCase() === prefix + 'yenilevel') {
  	let Kullanicimiz = message.author.avatarURL
        var imagetobase = `https://i.hizliresim.com/lZR1Zr.png`;
        Jimp.read(Kullanicimiz, function (err, profilekafa) {
            if (err) throw err;
            profilekafa.quality(60)
                      .resize(60, 58)
                      .write("profilkafa.jpg");
            Jimp.read(imagetobase, function (err, mydude) {
                if (err) throw err;
                Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(function (font) {
                    mydude.quality(60)
                    mydude.print(font, 47, 100, `${userData.level}`)            
                    mydude.composite( profilekafa, 28, 9 )
                    mydude.write("yenilevel.jpg")
                    mydude.getBuffer(`image/jpeg`, (err, buf) => {
                        if (err) return err;
                        message.channel.send({files: [{attachment: buf, name: `yenilevel.jpg`}] })
                    })
                })
            })}
        )};

  if (message.content.toLowerCase() === prefix + 'profil' || message.content.toLowerCase() === prefix + 'profile' || message.content.toLowerCase() === prefix + 'rank') {
  		message.channel.startTyping();
        let Kullanicimiz = message.author.avatarURL
        let KullanicimizinAdi = message.author.tag
        var imagetobase = `https://i.hizliresim.com/LD032b.jpg`;
        Jimp.read(Kullanicimiz, function (err, profilekafa) {
            if (err) throw err;
            profilekafa.quality(60)
                      .resize(95, 90)
                      .write("profilkafa.jpg");
            Jimp.read(imagetobase, function (err, mydude) {
                if (err) throw err;
                Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function (font) {
                    mydude.quality(60)
                    mydude.print(font, 122, 183, `${userData.level}`) 
                    mydude.print(font, 78, 229, `${userData.points}`) 
                Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(function (font) {
                    mydude.print(font, 123, 62, `${KullanicimizinAdi}`)                
                    mydude.composite( profilekafa, 22, 54 )
                    mydude.write("profil.jpg")
                    mydude.getBuffer(`image/jpeg`, (err, buf) => {
                        if (err) return err;
                        message.channel.send(`:pencil: **| ${user.username} adlı kullanıcının profil kartı**`)
                        message.channel.send({files: [{attachment: buf, name: `croxy-profil.jpg`}] })
                        message.channel.stopTyping();
                    })
                })
            })}
        )})
    }});


// Sunucuya birisi girdiği zaman mesajı yolluyalım

client.on("guildMemberAdd", async member => {
    let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
    const channel = member.guild.channels.find("name", "sayac")
    channel.send(`${sayac[member.guild.id].sayi} olmamıza son ${sayac[member.guild.id].sayi - member.guild.members.size} üye kaldı!`)
})

client.on("guildMemberRemove", async member => {
    let sayac = JSON.parse(fs.readFileSync("./ayarlar/sayac.json", "utf8"));
    const channel = member.guild.channels.find("name", "sayac")
    channel.send(`${sayac[member.guild.id].sayi} olmamıza son ${sayac[member.guild.id].sayi - member.guild.members.size} üye kaldı!`)
})

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);
