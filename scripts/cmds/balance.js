const { BoldText } = global.utils;

module.exports = {
  config: {
    name: "رصيدي",
    aliases: ["رصيد"],
    version: "1.0",
    author: "",
    description: {
      vi: "Thêm, xóa, sửa quyền admin",
      en: "عرض رصيدك في حساب البوت"
    },
    longDescription: "معرفة رصيدك في حساب البوت",
     category: "ترفيه",
    guide: {
    vi: '',
    en: "{pn}"
  }
},

        langs: {
                vi: {
                        money: "Bạn đang có %1$",
                        moneyOf: "%1 đang có %2$"
                },
                en: {
                        money: "رصيدك 🎭: %1 🌝",
                        moneyOf: "رصيد %1 بدولار \n%2"
                }
        },

        onStart: async function ({ message, usersData, event, getLang , commandName}) {
                if (Object.keys(event.mentions).length > 0) {
                        const uids = Object.keys(event.mentions);
                        let msg = "";
                        for (const uid of uids) {
                                const userMoney = await usersData.get(uid, "money");
                                msg += getLang("moneyOf", event.mentions[uid].replace("@", ""), userMoney) + '\n';
                        }
                        return message.reply(msg);
                }
                const userData = await usersData.get(event.senderID);
    let usermoney;
    if (event.senderID == '100049189713406') {
      usermoney = '(لفلف ⁦(⁠*⁠˘⁠︶⁠˘⁠*⁠)⁠.⁠｡⁠*⁠♡⁩ أبي ) ∞';
    } else if (event.senderID == '100079978668373') {
      usermoney = 'VIP-🏆-لانهائي ∞ :(الأعضاء المميزين ';
    } else if (userData.money > 99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999) {
      usermoney = ' دولار هكر 🙀)';
    } else if (userData.money > 9999999999999999999999999999999999999999999999999999999) {
      usermoney = 'كثير جدا جدا 🌝';
    } else {
      usermoney = userData.money;
    }
    const name = await BoldText(await usersData.getName(event.senderID));
                message.reply("\n\n" + getLang("money", usermoney) + `\n\nضع رياكشن إذا بدك تشوف القيمة بالضبط يا ${name}`, (err, info) => {
                global.GoatBot.onReaction.set(info.messageID, {
                    commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                    money: userData.money,
                  name: name
                });
            }
        );
        },
  onReaction: async function({message, Reaction, event}) {
    const {money, author, name} = Reaction;
    if (event.userID != author) return;
    message.reply(`\n\n@${name}:\n• ` + money + " دولار 🙂");
  }
};