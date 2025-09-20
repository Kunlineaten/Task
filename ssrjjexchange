const IDENTIFICATION = $persistentStore.read("JJ_IDENTIFICATION");
const aSIGN = $persistentStore.read("JJ_aSIGN");
const UA = $persistentStore.read("JJ_UA");
const APPDEVICE = $persistentStore.read("JJ_APPDEVICE");
const SMDEVICEID = $persistentStore.read("JJ_SMDeviceID");
const READERID = $persistentStore.read("JJ_READERID");

const versionCode = 672;
const welfare_exchange_id = 200;
const number = 8;

if (!aSIGN || !UA || !APPDEVICE || !SMDEVICEID || !READERID || !IDENTIFICATION) {
  $notification.post("❌ 缺少必要参数", "", "请先执行抓包脚本");
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
  'SMDeviceID': SMDEVICEID,
  'Host': 'app.jjwxc.org',
  'Accept-Language': 'zh-Hant-CN',
  'Accept': '*/*',
  'sign': aSIGN
};

$httpClient.get({ url, headers }, (error, response, data) => {
  if (error) {
    $notification.post("❌ 请求失败", "", error);
    return $done();
  }

  try {
    const o = JSON.parse(data);
    const code = o.code || "";
    const msg = o.message || "";

    if (code === "200") {
      $notification.post("✅ 兑换成功", "", msg);
    } else if (code === "190014") {
      $notification.post("⏳ 活动火爆", "", msg);
    } else if (code === "190016") {
      $notification.post("ℹ️ 已兑换", "", msg);
    } else if (code === "190005") {
      $notification.post("📅 活动未开始或已结束", "", msg);
    } else if (code === "1004") {
      $notification.post("🔒 登入验证失败", "", msg);
    } else {
      $notification.post("❌ 兑换失败", "", `code=${code} msg=${msg}`);
    }
  } catch (e) {
    $notification.post("❌ 解析失败", "", String(e));
  }

  $done();
});
