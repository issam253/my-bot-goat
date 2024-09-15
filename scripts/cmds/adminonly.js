const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
	config: {
		name: "ايقاف",
		aliases: ["off"],
		version: "1.5",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			vi: "bật/tắt chế độ chỉ admin mới có thể sử dụng bot",
			en: "ايقاف و تشغيل البوت"
		},
		category: "owner",
		guide: {
			vi: "   {pn} [on | off]: bật/tắt chế độ chỉ admin mới có thể sử dụng bot"
				+ "\n   {pn} noti [on | off]: bật/tắt thông báo khi người dùng không phải là admin sử dụng bot",
			en: "مادخلك"
		}
	},

	langs: {
		vi: {
			turnedOn: "Đã bật chế độ chỉ admin mới có thể sử dụng bot",
			turnedOff: "Đã tắt chế độ chỉ admin mới có thể sử dụng bot",
			turnedOnNoti: "Đã bật thông báo khi người dùng không phải là admin sử dụng bot",
			turnedOffNoti: "Đã tắt thông báo khi người dùng không phải là admin sử dụng bot"
		},
		en: {
			turnedOn: "تم ايقاف تشغيل البوت ⁦(⁠o⁠´⁠･⁠_⁠･⁠)⁠っ⁩",
			turnedOn: "تم تشغيل البوت ⁦⊂⁠(⁠´⁠･⁠◡⁠･⁠⊂⁠ ⁠)⁠∘⁠˚⁠˳⁠°⁩",
			turnedOnNoti: "تم تشغيل الإشعار عندما لا يكون المستخدم مسؤولاً عن استخدام الروبوت",
			turnedOffNoti: "تم إيقاف تشغيل الإشعارات عندما لا يكون المستخدم مسؤولاً عن استخدام الروبوت"
		}
	},

	onStart: function ({ args, message, getLang }) {
		let isSetNoti = false;
		let value;
		let indexGetVal = 0;

		if (args[0] == "اشعارات") {
			isSetNoti = true;
			indexGetVal = 1;
		}

		if (args[indexGetVal] == "تشغيل")
			value = true;
		else if (args[indexGetVal] == "ايقاف")
			value = false;
		else
			return message.SyntaxError();

		if (isSetNoti) {
			config.hideNotiMessage.adminOnly = !value;
			message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
		}
		else {
			config.adminOnly.enable = value;
			message.reply(getLang(value ? "turnedOn" : "turnedOff"));
		}

		fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
	}
};