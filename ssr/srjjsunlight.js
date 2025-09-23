/*
* 原創於坤離，任何疑問參考：https://kunlineaten.notion.site
 */
const IDENTIFICATION = $persistentStore.read("JJ_IDENTIFICATION");
const aSIGN = $persistentStore.read("JJ_aSIGN");
const UA = $persistentStore.read("JJ_UA");
const APPDEVICE = $persistentStore.read("JJ_APPDEVICE");
const READERID = $persistentStore.read("JJ_READERID");

const versionCode = 672;
const welfare_exchange_id = 201;
const number = 6;

if (!aSIGN || !UA || !APPDEVICE || !READERID || !IDENTIFICATION) {
  $done();
}

const url = `http://app.jjwxc.org/newWelfareIos/executeExchange`
  + `?identification=${encodeURIComponent(IDENTIFICATION)}`
  + `&number=${number}`
  + `&sign=${encodeURIComponent(aSIGN)}`
  + `&versionCode=${versionCode}`
  + `&welfare_exchange_id=${welfare_exchange_id}`;

const headers = {
  'readerid': READERID,
  'Connection': 'keep-alive',
  'Accept-Encoding': 'gzip, deflate',
  'APPDEVICE': APPDEVICE,
  'versiontype': 'reading',
  'source': 'ios',
  'User-Agent': UA,
  'versionCode': String(versionCode),
  'platformType': 'iOS',
  'Host': 'app.jjwxc.org',
  'Accept-Language': 'zh-Hant-CN',
  'Accept': '*/*',
  'sign': aSIGN
};

$httpClient.get({ url, headers }, (error, response, data) => {
  if (error) {
    $notification.post("❌ 请求失败", "网络错误", error);
    return $done();
  }

  try {
    const o = JSON.parse(data);
    const code = o.code || "";
    const msg = o.message || "";

    switch (code) {
      case "200":
        $notification.post("✅ 兑换成功", "", msg);
        break;
      case "190014":
        $notification.post("⏳ 活动火爆", "请稍后再试", msg);
        break;
      case "190016":
        $notification.post("ℹ️ 已兑换", "", msg);
        break;
      case "190005":
        $notification.post("📅 活动未开始或已结束", "", msg);
        break;
      case "1004":
        $notification.post("🔒 登入验证失败", "", msg);
        break;
      default:
        $notification.post("❌ 未知错误", `code=${code}`, msg);
    }
  } catch (e) {
    $notification.post("❌ 返回解析失败", "", String(e));
  }

  $done();
});
