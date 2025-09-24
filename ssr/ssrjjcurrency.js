/*
 * 未经授权不得传播、修改或转售。脚本更新请以作者提供的最新版本为准。
 * 若需获取更新或遇到问题，请通过原购买渠道联系作者，或访问网站：https://kunlineaten.notion.site
 */
const IDENTIFICATION = $persistentStore.read("JJ_IDENTIFICATION");
const aSIGN = $persistentStore.read("JJ_aSIGN");
const UA = $persistentStore.read("JJ_UA");
const APPDEVICE = $persistentStore.read("JJ_APPDEVICE");
const READERID = $persistentStore.read("JJ_READERID");

const versionCode = 672;
const welfare_exchange_id = 200;
const number = 8;

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
  'APPDEVICE': APPDEVICE,
  'User-Agent': UA,
  'versionCode': String(versionCode),
  'Host': 'app.jjwxc.org',
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
