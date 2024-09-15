const itunes = require("searchitunes");
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "ابستور",
		version: "1.2",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "Tìm ap",
			en: "البحث عن تطبيقات "
		},
		category: "software",
		guide: "   {pn}: <تطبيقات>"
			+ "\n   - مثال:"
			+ "\n   {pn} بابجي",
		envConfig: {
			limitResult: 3
		}
	},

	langs: {
		vi: {
			missingKeyword: "Bạn chưa nhập từ khóa",
			noResult: "Không tìm thấy kết quả nào cho từ khóa %1"
		},
		en: {
			missingKeyword: "لم تقم بإدخال أي كلمة رئيسية",
			noResult: "لا يوجد  %1"
		}
	},

	onStart: async function ({ message, args, commandName, envCommands, getLang }) {
		if (!args[0])
			return message.reply(getLang("missingKeyword"));
		let results = [];
		try {
			results = (await itunes({
				entity: "software",
				country: "VN",
				term: args.join(" "),
				limit: envCommands[commandName].limitResult
			})).results;
		}
		catch (err) {
			return message.reply(getLang("noResult", args.join(" ")));
		}

		if (results.length > 0) {
			let msg = "";
			const pedningImages = [];
			for (const result of results) {
				msg += `\n\n- ${result.trackCensoredName} الشركة ${result.artistName}, ${result.formattedPrice} وتصنيفها ${"🌟".repeat(result.averageUserRating)} (${result.averageUserRating.toFixed(1)}/5)`
					+ `\n- ${result.trackViewUrl}`;
				pedningImages.push(await getStreamFromURL(result.artworkUrl512 || result.artworkUrl100 || result.artworkUrl60));
			}
			message.reply({
				body: msg,
				attachment: await Promise.all(pedningImages)
			});
		}
		else {
			message.reply(getLang("noResult", args.join(" ")));
		}
	}
};