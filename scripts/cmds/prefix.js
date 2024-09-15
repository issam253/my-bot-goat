const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "بادئة",
     aliases: ['prefix'],
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: "تعديل بادئة البوت ",
		category: "ادمن",
		guide: {
			vi: "   {pn} <بادئة جديدة>: thay đổi prefix mới trong box chat của bạn"
				+ "\n   Ví dụ:"
				+ "\n    {pn} #"
				+ "\n\n   {pn} <new prefix> -g: thay đổi prefix mới trong hệ thống bot (chỉ admin bot)"
				+ "\n   Ví dụ:"
				+ "\n    {pn} # -g"
				+ "\n\n   {pn} reset: thay đổi prefix trong box chat của bạn về mặc định",
			en: "   {pn} <بادئة جديدة >: اضافة بادئة جديدة "
				+ "\n   أمثلة :"
				+ "\n    {pn} #"
				+ "\n\n   {pn} <بادئة جديدة> -ب: لتغير بادئة البوت"
				+ "\n   الأمثلة:"
				+ "\n    {pn} # -ب"
				+ "\n\n   {pn} رست: إعادة بادئة البوت"
		}
	},

	langs: {
		vi: {
			reset: "Đã reset prefix của bạn về mặc định: %1",
			onlyAdmin: "Chỉ admin mới có thể thay đổi prefix hệ thống bot",
			confirmGlobal: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix của toàn bộ hệ thống bot",
			confirmThisThread: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix trong nhóm chat của bạn",
			successGlobal: "Đã thay đổi prefix hệ thống bot thành: %1",
			successThisThread: "Đã thay đổi prefix trong nhóm chat của bạn thành: %1",
			myPrefix: "🌐 Prefix của hệ thống: %1\n🛸 Prefix của nhóm bạn: %2"
		},
		en: {
			reset: "تمت إعادة البادئة الى: %1",
			onlyAdmin: "وحدهم المسؤولين يمكنهم تعديل البادئة",
			confirmGlobal: "يرجى إسقاط اي رد على الرسالة ",
			confirmThisThread: "يرجى إسقاط اي شيء رد على الرسالة ",
			successGlobal: "تم تغير بادئة البوت إلى : %1",
			successThisThread: "تم تغير بادئة المجموعة إلى : %1",
			myPrefix: "🌐 بادئة البوت: %1\n🛸 بادئة المجموعة : %2"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0])
			return message.SyntaxError();

		if (args[0] == 'رست') {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix
		};

		if (args[1] === "-ب")
			if (role < 2)
				return message.reply(getLang("onlyAdmin"));
			else
				formSet.setGlobal = true;
		else
			formSet.setGlobal = false;

		return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author)
			return;
		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		}
		else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply(getLang("successThisThread", newPrefix));
		}
	},

	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "البادئة")
			return () => {
				return message.reply(getLang("myPrefix", global.GoatBot.config.prefix ? global.GoatBot.config.prefix: "بدون بادئة", utils.getPrefix(event.threadID)));
			};
	}
};