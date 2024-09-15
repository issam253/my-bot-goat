function checkShortCut(nickname, uid, userName) {
	/\{userName\}/gi.test(nickname) ? nickname = nickname.replace(/\{userName\}/gi, userName) : null;
	/\{userID\}/gi.test(uid) ? nickname = nickname.replace(/\{userID\}/gi, uid) : null;
	return nickname;
}

module.exports = {
	config: {
		name: "كنية",
		version: "1.3",
		author: "NTKhang",
		cooldowns: 5,
		role: 1,
		description: {
			vi: "Tự đổi biệt danh cho thành viên mới vào nhóm chat",
			en: "تغيير لقب العضو الجديد تلقائيًا"
		},
		category: "box chat",
		guide: {
			vi: '   {pn} set <nickname>: dùng để cài đặt cấu hình để tự đổi biệt danh, với các shortcut có sẵn:'
				+ '\n   + {userName}: tên thành viên vào nhóm'
				+ '\n   + {userID}: id thành viên'
				+ '\n   Ví dụ:'
				+ '\n    {pn} set {userName} 🚀'
				+ '\n\n   {pn} [on | off]: dùng để bật/tắt tính năng này'
				+ '\n\n   {pn} [view | info]: hiển thị cấu hình hiện tại',
			en: '   {pn} تعيين <الكنية>: يُستخدم لتعيين التكوين لتغيير اللقب تلقائيًا، مع بعض الاختصارات:'
				+ '\n   + {userName}: هاذا إسم المستخدم'
				+ '\n   + {userID}: ادي المستخدم'
				+ '\n   مثال:'
				+ '\n    {pn} اضف {userName} 🚀'
				+ '\n\n   {pn} [ايقاف | تشغيل]: تستخدم لتشغيل و ايقاف الميز'
				+ '\n\n   {pn} [عرض | معلومات]: لعرض معلومات الكنيات'
		}
	},

	langs: {
		vi: {
			missingConfig: "Vui lòng nhập cấu hình cần thiết",
			configSuccess: "Cấu hình đã được cài đặt thành công",
			currentConfig: "Cấu hình autoSetName hiện tại trong nhóm chat của bạn là:\n%1",
			notSetConfig: "Hiện tại nhóm bạn chưa cài đặt cấu hình autoSetName",
			syntaxError: "Sai cú pháp, chỉ có thể dùng \"{pn} on\" hoặc \"{pn} off\"",
			turnOnSuccess: "Tính năng autoSetName đã được bật",
			turnOffSuccess: "Tính năng autoSetName đã được tắt",
			error: "Đã có lỗi xảy ra khi sử dụng chức năng autoSetName, thử tắt tính năng liên kết mời trong nhóm và thử lại sau"
		},
		en: {
			missingConfig: "ادخل الكنية التلقائية ",
			configSuccess: "تم ضبط التكوين بنجاح",
			currentConfig: "تكوين اوتونام الحالي في مجموعة الدردشة الخاصة بك هو:\n%1",
			notSetConfig: "لم تقم مجموعتك بتعيين تكوين اوتونام",
			syntaxError: "استخدام خاطء, 🤡 \"{pn} تشغيل\" او \"{pn} ايقاف\" 🌝",
			turnOnSuccess: "تم تشغيل ميزة تم تشغيل ميزة اوتونام",
			turnOffSuccess: "تم إيقاف تشغيل ميزة اوتون٦",
			error: "حدث خطأ أثناء استخدام ميزة اوتونام، حاول إيقاف تشغيل ميزة رابط الدعوة في المجموعة وحاول مرة أخرى لاحقًا"
		}
	},

	onStart: async function ({ message, event, args, threadsData, getLang }) {
		switch (args[0]) {
			case "اضف":
			case "add":
			case "config": {
				if (args.length < 2)
					return message.reply(getLang("missingConfig"));
				const configAutoSetName = args.slice(1).join(" ");
				await threadsData.set(event.threadID, configAutoSetName, "data.autoSetName");
				return message.reply(getLang("configSuccess"));
			}
			case "عرض":
			case "معلومات": {
				const configAutoSetName = await threadsData.get(event.threadID, "data.autoSetName");
				return message.reply(configAutoSetName ? getLang("currentConfig", configAutoSetName) : getLang("notSetConfig"));
			}
			default: {
				const enableOrDisable = args[0];
				if (enableOrDisable !== "تشغيل" && enableOrDisable !== "ايقاف")
					return message.reply(getLang("syntaxError"));
				await threadsData.set(event.threadID, enableOrDisable === "تشغيل", "settings.enableAutoSetName");
				return message.reply(enableOrDisable == "تشغيل" ? getLang("turnOnSuccess") : getLang("turnOffSuccess"));
			}
		}
	},

	onEvent: async ({ message, event, api, threadsData, getLang }) => {
		if (event.logMessageType !== "log:subscribe")
			return;
		if (!await threadsData.get(event.threadID, "settings.enableAutoSetName"))
			return;
		const configAutoSetName = await threadsData.get(event.threadID, "data.autoSetName");

		return async function () {
			const addedParticipants = [...event.logMessageData.addedParticipants];

			for (const user of addedParticipants) {
				const { userFbId: uid, fullName: userName } = user;
				try {
					await api.changeNickname(checkShortCut(configAutoSetName, uid, userName), event.threadID, uid);
				}
				catch (e) {
					return message.reply(getLang("error"));
				}
			}
		};
	}
};