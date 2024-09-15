const { findUid } = global.utils;
const moment = require("moment-timezone");

module.exports = {
	config: {
		name: "حظر",
		version: "1.3",
		author: "NTKhang",
		countDown: 5,
		role: 1,
		description: {
			vi: "Cấm thành viên khỏi box chat",
			en: "حظر المستخدم من الدردشة"
		},
		category: "المجموعات",
		guide: {
			vi: "   {pn} [@tag|uid|link fb|reply] [<lý do cấm>|để trống nếu không có lý do]: Cấm thành viên khỏi box chat"
				+ "\n   {pn} check: Kiểm tra thành viên bị cấm và kick thành viên đó ra khỏi box chat"
				+ "\n   {pn} unban [@tag|uid|link fb|reply]: Bỏ cấm thành viên khỏi box chat"
				+ "\n   {pn} list: Xem danh sách thành viên bị cấm",
			en: "   {pn} [@تاغ|ادي|رابط|رد] [<السبب>|اتركه فارغًا إذا لم يكن هناك سبب]: حظر المستخدم من الدردشة المباشرة"
				+ "\n   {pn} فحص: التحقق من الأعضاء المحظورين وطردهم من الدردشة"
				+ "\n   {pn} فك [@تاغ|ادي|رابط|رد]: قم بإلغاء حظر المستخدم من المجموعة"
				+ "\n   {pn} قائمة: عرض قائمة الأعضاء المحظورين"
		}
	},

	langs: {
		vi: {
			notFoundTarget: "⚠️ | Vui lòng tag người cần cấm hoặc nhập uid hoặc link fb hoặc phản hồi tin nhắn của người cần cấm",
			notFoundTargetUnban: "⚠️ | Vui lòng tag người cần bỏ cấm hoặc nhập uid hoặc link fb hoặc phản hồi tin nhắn của người cần bỏ cấm",
			userNotBanned: "⚠️ | Người mang id %1 không bị cấm khỏi box chat này",
			unbannedSuccess: "✅ | Đã bỏ cấm %1 khỏi box chat!",
			cantSelfBan: "⚠️ | Bạn không thể tự cấm chính mình!",
			cantBanAdmin: "❌ | Bạn không thể cấm quản trị viên!",
			existedBan: "❌ | Người này đã bị cấm từ trước!",
			noReason: "Không có lý do",
			bannedSuccess: "✅ | Đã cấm %1 khỏi box chat!",
			needAdmin: "⚠️ | Bot cần quyền quản trị viên để kick thành viên bị cấm",
			noName: "Người dùng facebook",
			noData: "📑 | Không có thành viên nào bị cấm trong box chat này",
			listBanned: "📑 | Danh sách thành viên bị cấm trong box chat này (trang %1/%2)",
			content: "%1/ %2 (%3)\nLý do: %4\nThời gian cấm: %5\n\n",
			needAdminToKick: "⚠️ | Thành viên %1 (%2) bị cấm khỏi box chat, nhưng bot không có quyền quản trị viên để kick thành viên này, vui lòng cấp quyền quản trị viên cho bot để kick thành viên này",
			bannedKick: "⚠️ | %1 đã bị cấm khỏi box chat từ trước!\nUID: %2\nLý do: %3\nThời gian cấm: %4\n\nBot đã tự động kick thành viên này"
		},
		en: {
			notFoundTarget: "⚠️ | يرجى الإشارة إلى الشخص المراد حظره أو إدخال رابط او ادي أو الرد على رسالة الشخص المراد حظره",
			notFoundTargetUnban: "⚠️ | يرجى الإشارة إلى الشخص الذي يريد رفع الحظر عنه أو إدخال رابط او ادي  أو الرد على رسالة الشخص الذي يريد رفع الحظر عنه",
			userNotBanned: "⚠️ | الشخص ذو الهوية %1 غير محظور من مربع الدردشة هذا",
			unbannedSuccess: "✅ | غير محظور %1 من صندوق الدردشة!",
			cantSelfBan: "⚠️ | لا يمكنك حظر نفسك!",
			cantBanAdmin: "❌ | لا يمكنك حظر المسؤول!",
			existedBan: "❌ | لقد تم حظر هذا الشخص من قبل!",
			noReason: "بدون سبب",
			bannedSuccess: "✅ | محظور %1 من صندوق الدردشة!",
			needAdmin: "⚠️ | يحتاج الروبوت إلى إذن المسؤول لطرد الأعضاء المحظورين",
			noName: "مستخدم البوت",
			noData: "📑 | لا يوجد أعضاء محظورين في دردشة الصندوق هذه",
			listBanned: "📑 | قائمة الأعضاء المحظورين في صندوق الدردشة هذا (صفحة %1/%2)",
			content: "%1/ %2 (%3)\n سبب: %4\n وقت الحظر: %5\n\n",
			needAdminToKick: "⚠️ | عضو %1 (%2) تم حظره من Box chat، لكن الروبوت ليس لديه إذن المسؤول لطرد هذا العضو، يرجى منح إذن المسؤول للروبوت لطرد هذا العضو",
			bannedKick: "⚠️ | %1 لقد تم حظره من صندوق الدردشة من قبل!\nادي: %2\nالسبب: %3\n%وقت الحظر: %4\n\n على حد سواء كما طرد هذا العضو تلقائيا"
		}
	},

	onStart: async function ({ message, event, args, threadsData, getLang, usersData, api }) {
		const { members, adminIDs } = await threadsData.get(event.threadID);
		const { senderID } = event;
		let target;
		let reason;

		const dataBanned = await threadsData.get(event.threadID, 'data.banned_ban', []);

		if (args[0] == 'فك') {
			if (!isNaN(args[1]))
				target = args[1];
			else if (args[1]?.startsWith('https'))
				target = await findUid(args[1]);
			else if (Object.keys(event.mentions || {}).length)
				target = Object.keys(event.mentions)[0];
			else if (event.messageReply?.senderID)
				target = event.messageReply.senderID;
			else
				return api.sendMessage(getLang('notFoundTargetUnban'), event.threadID, event.messageID);

			const index = dataBanned.findIndex(item => item.id == target);
			if (index == -1)
				return api.sendMessage(getLang('userNotBanned', target), event.threadID, event.messageID);

			dataBanned.splice(index, 1);
			await threadsData.set(event.threadID, dataBanned, 'data.banned_ban');
			const userName = members[target]?.name || await usersData.getName(target) || getLang('noName');

			return api.sendMessage(getLang('unbannedSuccess', userName), event.threadID, event.messageID);
		}
		else if (args[0] == "check") {
			if (!dataBanned.length)
				return;
			for (const user of dataBanned) {
				if (event.participantIDs.includes(user.id))
					api.removeUserFromGroup(user.id, event.threadID);
			}
		}

		if (event.messageReply?.senderID) {
			target = event.messageReply.senderID;
			reason = args.join(' ');
		}
		else if (Object.keys(event.mentions || {}).length) {
			target = Object.keys(event.mentions)[0];
			reason = args.join(' ').replace(event.mentions[target], '');
		}
		else if (!isNaN(args[0])) {
			target = args[0];
			reason = args.slice(1).join(' ');
		}
		else if (args[0]?.startsWith('https')) {
			target = await findUid(args[0]);
			reason = args.slice(1).join(' ');
		}
		else if (args[0] == 'قائمة') {
			if (!dataBanned.length)
				return message.reply(getLang('noData'));
			const limit = 20;
			const page = parseInt(args[1] || 1) || 1;
			const start = (page - 1) * limit;
			const end = page * limit;
			const data = dataBanned.slice(start, end);
			let msg = '';
			let count = 0;
			for (const user of data) {
				count++;
				const name = members[user.id]?.name || await usersData.getName(user.id) || getLang('noName');
				const time = user.time;
				msg += getLang('content', start + count, name, user.id, user.reason, time);
			}
			return message.reply(getLang('listBanned', page, Math.ceil(dataBanned.length / limit)) + '\n\n' + msg);
		}

		if (!target)
			return message.reply(getLang('notFoundTarget'));
		if (target == senderID)
			return message.reply(getLang('cantSelfBan'));
		if (adminIDs.includes(target))
			return message.reply(getLang('cantBanAdmin'));

		const banned = dataBanned.find(item => item.id == target);
		if (banned)
			return message.reply(getLang('existedBan'));

		const name = members[target]?.name || (await usersData.getName(target)) || getLang('noName');
		const time = moment().tz(global.GoatBot.config.timeZone).format('HH:mm:ss DD/MM/YYYY');
		const data = {
			id: target,
			time,
			reason: reason || getLang('noReason')
		};

		dataBanned.push(data);
		await threadsData.set(event.threadID, dataBanned, 'data.banned_ban');
		message.reply(getLang('bannedSuccess', name), () => {
			if (members.some(item => item.userID == target)) {
				if (adminIDs.includes(api.getCurrentUserID()))
					api.removeUserFromGroup(target, event.threadID);
				else
					message.send(getLang('needAdmin'), (err, info) => {
						global.GoatBot.onEvent.push({
							messageID: info.messageID,
							onStart: ({ event }) => {
								if (event.logMessageType === "log:thread-admins" && event.logMessageData.ADMIN_EVENT == "add_admin") {
									const { TARGET_ID } = event.logMessageData;
									if (TARGET_ID == api.getCurrentUserID()) {
										api.removeUserFromGroup(target, event.threadID, () => global.GoatBot.onEvent = global.GoatBot.onEvent.filter(item => item.messageID != info.messageID));
									}
								}
							}
						});
					});
			}
		});
	},

	onEvent: async function ({ event, api, threadsData, getLang, message }) {
		if (event.logMessageType == "log:subscribe") {
			const { threadID } = event;
			const dataBanned = await threadsData.get(threadID, 'data.banned_ban', []);
			const usersAdded = event.logMessageData.addedParticipants;

			for (const user of usersAdded) {
				const { userFbId, fullName } = user;
				const banned = dataBanned.find(item => item.id == userFbId);
				if (banned) {
					const reason = banned.reason || getLang('noReason');
					const time = banned.time;
					return api.removeUserFromGroup(userFbId, threadID, err => {
						if (err)
							return message.send(getLang('needAdminToKick', fullName, userFbId), (err, info) => {
								global.GoatBot.onEvent.push({
									messageID: info.messageID,
									onStart: ({ event }) => {
										if (event.logMessageType === "log:thread-admins" && event.logMessageData.ADMIN_EVENT == "add_admin") {
											const { TARGET_ID } = event.logMessageData;
											if (TARGET_ID == api.getCurrentUserID()) {
												api.removeUserFromGroup(userFbId, event.threadID, () => global.GoatBot.onEvent = global.GoatBot.onEvent.filter(item => item.messageID != info.messageID));
											}
										}
									}
								});
							});
						else
							message.send(getLang('bannedKick', fullName, userFbId, reason, time));
					});
				}
			}
		}
	}
};