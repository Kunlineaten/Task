/*
 * 未经授权不得传播、修改或转售。脚本更新请以作者提供的最新版本为准。
 * 若需获取更新或遇到问题，请通过原购买渠道联系作者，或访问网站：https://kunlineaten.notion.site
 */
const identification = $persistentStore.read("JJ_IDENTIFICATION");
const ua = $persistentStore.read("JJ_UA");
const appdevice = $persistentStore.read("JJ_APPDEVICE");
const readerid = $persistentStore.read("JJ_READERID");
const sign = $persistentStore.read("JJ_aSIGN");
const versionCode = $persistentStore.read("JJ_versionCode");
let message = `
IDENTIFICATION: ${identification|| "未获取"}
UA: ${ua|| "未获取"}
APPDEVICE: ${appdevice|| "未获取"}
READERID: ${readerid || "未获取"}
aSIGN: ${sign || "未获取"}
versionCode: ${versionCode || "未获取"}
`;
$notification.post("📦 JJ 参数查看", "", message.trim());
$done();
