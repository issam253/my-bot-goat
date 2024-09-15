const { getTime, drive } = global.utils;

module.exports = {
  config: {
    name: "leave",
    version: "1.4",
    author: "NTKhang",
    category: "events"
  },

  langs: {
    vi: {
      session1: "sáng",
      session2: "trưa",
      session3: "chiều",
      session4: "tối",
      leaveType1: "tự rời",
      leaveType2: "bị kick",
      defaultLeaveMessage: "{userName} đã {type} khỏi nhóm"
    },
    en: {
      session1: "morning",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      leaveType1: "غادر بكرامته",
      leaveType2: "تم طرده بدون ملابس",
      defaultLeaveMessage: "{userName} {type} من المجموعة"
    }
  },

  onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
    if (event.logMessageType == "log:unsubscribe")
      return async function() {
        const { threadID } = event;
        const threadData = await threadsData.get(threadID);
        if (!threadData.settings.sendLeaveMessage)
          return;
        const { leftParticipantFbId } = event.logMessageData;
        if (leftParticipantFbId == api.getCurrentUserID())
          return;
        const hours = getTime("HH");

        const threadName = threadData.threadName;
        const userName = await usersData.getName(leftParticipantFbId);

        // {userName}   : name of the user who left the group
        // {type}       : type of the message (leave)
        // {boxName}    : name of the box
        // {threadName} : name of the box
        // {time}       : time
        // {session}    : session

        let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;

        leaveMessage = leaveMessage
          .replace(/\{userName\}|\{userNameTag\}/g, userName)
          .replace(/\{type\}/g, leftParticipantFbId == event.author ? getLang("leaveType1") : getLang("leaveType2"))
          .replace(/\{threadName\}|\{boxName\}/g, threadName)
          .replace(/\{time\}/g, hours)
          .replace(/\{session\}/g, hours <= 10 ?
            getLang("session1") :
            hours <= 12 ?
            getLang("session2") :
            hours <= 18 ?
            getLang("session3") :
            getLang("session4")
          );

        form.body = leaveMessage;

        if (leaveMessage.includes("{userNameTag}")) {
          form.mentions = [{
            id: leftParticipantFbId,
            tag: userName
					}];
        }

        if (threadData.data.leaveAttachment) {
          const files = threadData.data.leaveAttachment;
          const attachments = files.reduce((acc, file) => {
            acc.push(drive.getFile(file, "stream"));
            return acc;
          }, []);
          form.attachment = (await global.utils.getStreamFromURL("https://i.ibb.co/ggfkDQj/449660157-923028429863138-8611989659087465109-n-jpg-nc-cat-109-ccb-1-7-nc-sid-9f807c-nc-eui2-Ae-G-Hj.jpg"))
            
        }
        message.send(form);
      };
  }
};