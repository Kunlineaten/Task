/*
[task_local]
# 每天 09:05 執行一次
5 9 * * * https://raw.githubusercontent.com/Kunlineaten/Task/main/qx/gkd011_checkin_qx.js, tag=GKD011 自動簽到, enabled=true

[mitm]
hostname = www.gkd011.top
*/

const CFG = {
  baseUrl: "https://www.gkd011.top",
  checkinPath: "/api/checkin", // TODO: 抓包得到的簽到接口
  cookie: $prefs.valueForKey("GKD011_COOKIE") || "",
  timeout: 20000
};

function done(msg) {
  console.log(msg);
  $notify("GKD011 簽到", "", msg);
  $done();
}

function parseJSON(text) {
  try { return JSON.parse(text || "{}"); } catch { return {}; }
}

function request(options) {
  return new Promise((resolve, reject) => {
    $task.fetch(options).then(resolve, reject);
  });
}

async function run() {
  if (!CFG.cookie) {
    return done("❌ 未找到 Cookie，請先執行 gkd011_cookie_qx.js 抓取");
  }

  const checkinReq = {
    url: `${CFG.baseUrl}${CFG.checkinPath}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Cookie": CFG.cookie,
      "Origin": CFG.baseUrl,
      "Referer": `${CFG.baseUrl}/`
    },
    body: JSON.stringify({}),
    timeout: CFG.timeout
  };

  console.log("🚀 checkin => " + checkinReq.url);
  const checkinResp = await request(checkinReq);
  const checkinJson = parseJSON(checkinResp.body);

  const ok =
    checkinResp.statusCode === 200 ||
    checkinJson.success === true ||
    checkinJson.code === 0 ||
    checkinJson.status === 1;

  if (ok) {
    return done(`✅ 簽到成功：${checkinJson.message || checkinJson.msg || "OK"}`);
  }

  return done(`⚠️ 簽到返回異常：HTTP ${checkinResp.statusCode}，${checkinJson.message || checkinJson.msg || checkinResp.body || "未知錯誤"}`);
}

run().catch(err => {
  done("❌ 執行失敗：" + (err && err.message ? err.message : String(err)));
});
