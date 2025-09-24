/*
 * 未经授权不得传播、修改或转售。脚本更新请以作者提供的最新版本为准。
 * 若需获取更新或遇到问题，请通过原购买渠道联系作者，或访问网站：https://kunlineaten.notion.site
 */

const IDENTIFICATION = $prefs.valueForKey("JJ_IDENTIFICATION") || "";
const aSIGN         = $prefs.valueForKey("JJ_aSIGN") || "";
const UA            = $prefs.valueForKey("JJ_UA") || "";
const APPDEVICE     = $prefs.valueForKey("JJ_APPDEVICE") || "";
const SMDEVICEID    = $prefs.valueForKey("JJ_SMDeviceID") || "";
const READERID      = $prefs.valueForKey("JJ_READERID") || "";
const versionCode   = 672;
const hostOrigin    = "http://app.jjwxc.org";
const welfare_exchange_id = 200;
const number = 8;

if (!aSIGN || !UA || !APPDEVICE || !SMDEVICEID || !READERID || !IDENTIFICATION) {
  console.log("❌ 缺少必要参数！");
  console.log("aSIGN: " + aSIGN);
  console.log("UA: " + UA);
  console.log("APPDEVICE: " + APPDEVICE);
  console.log("SMDEVICEID: " + SMDEVICEID);
  console.log("READERID: " + READERID);
  console.log("IDENTIFICATION: " + IDENTIFICATION);
  $notify("❌ 缺少必要参数", "", "请先运行 cookie.js 抓包脚本");
  $done();
}

const url = `${hostOrigin}/newWelfareIos/executeExchange`
  + `?identification=${encodeURIComponent(IDENTIFICATION)}`
  + `&number=${encodeURIComponent(number)}`
  + `&sign=${encodeURIComponent(aSIGN)}`
  + `&versionCode=${encodeURIComponent(versionCode)}`
  + `&welfare_exchange_id=${encodeURIComponent(welfare_exchange_id)}`;

const headers = {
  'readerid': READERID,
  'Connection': 'keep-alive',
  'Accept-Encoding': 'br;q=1.0, gzip;q=0.9, deflate;q=0.8',
  'APPDEVICE': APPDEVICE,
  'versiontype': 'reading',
  'source': 'ios',
  'User-Agent': UA,
  'versionCode': String(versionCode),
  'platformType': 'iOS',
  'SMDeviceID': SMDEVICEID,
  'Host': 'app.jjwxc.org',
  'Accept-Language': 'zh-Hant-CN;q=1.0, en-CN;q=0.9, zh-Hans-CN;q=0.8, ja-CN;q=0.7',
  'Accept': '*/*',
  'sign': aSIGN
};

const req = { url, method: 'GET', headers };
console.log("🚀 URL:\n" + url);
console.log("📤 Headers:\n" + JSON.stringify(headers, null, 2));

$task.fetch(req).then(resp => {
  console.log("📥 Body:\n" + resp.body);
  try {
    const o = JSON.parse(resp.body || "{}");
    if (code === "200") {
      $notify("✅ 兑换成功", "", o.message || "OK");
      $done({ status: resp.statusCode, body: bodyText });
      return;
    }

    if (code === "190014") {
     // 不重试，由外层定时任务或人工再次执行
      $notify("⏳ 活动火爆，稍后再试", "", o.message || "190014：请下个小时再来参与");
      $done({ status: resp.statusCode, body: bodyText });
      return;
    }

    if (code === "190016") {
      $notify("ℹ️ 本期已兑换", "", o.message || "190016：看看其他奖品吧");
      $done({ status: resp.statusCode, body: bodyText });
      return;
    }

    if (code === "190005") {
      $notify("📅 活动未开始或已结束", "", o.message || "190005：请确认活动时间");
      $done({ status: resp.statusCode, body: bodyText });
      return;
    }

    if (code === "1004") {
      $notify("🔒 登入验证失败", "", o.message || "1004：请检查 sign/版本号/域名/Headers 是否一致");
      $done({ status: resp.statusCode, body: bodyText });
      return;
    } else {
      $notify("❌ 兑换失败", "", `code=${o.code} msg=${o.message || ""}`);
    }
  } catch (e) {
    $notify("❌ JSON 解析失败", "", String(e));
  }
  $done();
}).catch(err => {
  $notify("❌ 请求异常", "", JSON.stringify(err));
  $done();
});
