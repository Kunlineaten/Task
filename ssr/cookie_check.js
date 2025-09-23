// 读取已存储的参数
const identification = $persistentStore.read("JJ_IDENTIFICATION");
const ua = $persistentStore.read("JJ_UA");
const appdevice = $persistentStore.read("JJ_APPDEVICE");
const readerid = $persistentStore.read("JJ_READERID");
const sign = $persistentStore.read("JJ_aSIGN");
const versionCode = $persistentStore.read("JJ_versionCode");

// 组织显示内容
let message = `
IDENTIFICATION: ${identification|| "未获取"}
UA: ${ua|| "未获取"}
APPDEVICE: ${appdevice|| "未获取"}
READERID: ${readerid || "未获取"}
aSIGN: ${sign || "未获取"}
versionCode: ${versionCode || "未获取"}
`;

// 弹出通知
$notification.post("📦 JJ 参数查看", "", message.trim());
$done();
