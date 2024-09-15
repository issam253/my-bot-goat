const fs = require("fs-extra");

module.exports = {
	config: {
		name: "بينات",
		version: "1.3",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			vi: "Sao lưu dữ liệu của bot (threads, users, dashboard, globalData)",
			en: "النسخ الاحتياطي لبيانات الروبوت (المواضيع والمستخدمين ولوحة القيادة والبيانات العالمية)"
		},
		category: "ادمن",
		guide: {
			en: "   {pn}"
		}
	},

	langs: {
		vi: {
			backedUp: "Đã sao lưu dữ liệu của bot vào thư mục scripts/cmds/tmp"
		},
		en: {
			backedUp: "تم عمل نسخة احتياطية من بيانات الروبوت في المجلد scripts/cmds/tmp"
		}
	},

	onStart: async function ({ message, getLang, threadsData, usersData, dashBoardData, globalData }) {
		const [globalDataBackup, threadsDataBackup, usersDataBackup, dashBoardDataBackup] = await Promise.all([
			globalData.getAll(),
			threadsData.getAll(),
			usersData.getAll(),
			dashBoardData.getAll()
		]);

		const pathThreads = `${__dirname}/tmp/threadsData.json`;
		const pathUsers = `${__dirname}/tmp/usersData.json`;
		const pathDashBoard = `${__dirname}/tmp/dashBoardData.json`;
		const pathGlobal = `${__dirname}/tmp/globalData.json`;

		fs.writeFileSync(pathThreads, JSON.stringify(threadsDataBackup, null, 2));
		fs.writeFileSync(pathUsers, JSON.stringify(usersDataBackup, null, 2));
		fs.writeFileSync(pathDashBoard, JSON.stringify(dashBoardDataBackup, null, 2));
		fs.writeFileSync(pathGlobal, JSON.stringify(globalDataBackup, null, 2));

		message.reply({
			body: getLang("backedUp"),
			attachment: [
				fs.createReadStream(pathThreads),
				fs.createReadStream(pathUsers),
				fs.createReadStream(pathDashBoard),
				fs.createReadStream(pathGlobal)
			]
		});
	}
};