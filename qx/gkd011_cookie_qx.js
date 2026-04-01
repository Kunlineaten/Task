/*
[rewrite_local]
^https:\/\/www\.gkd011\.top\/.* url script-request-header https://raw.githubusercontent.com/<你的倉庫>/Task/main/qx/gkd011_cookie_qx.js

[mitm]
hostname = www.gkd011.top
*/

(function () {
  try {
    const url = $request.url || "";
    const headers = $request.headers || {};
    const cookie = headers.Cookie || headers.cookie || "";

    if (!cookie) {
      console.log("⚠️ 此請求沒有 Cookie，略過: " + url);
      return $done({});
    }

    $prefs.setValueForKey(cookie, "GKD011_COOKIE");
    console.log("✅ GKD011_COOKIE 已更新");
    $notify("GKD011 Cookie 抓取成功", "", "已寫入 GKD011_COOKIE");
  } catch (e) {
    console.log("❌ Cookie 抓取失敗: " + e);
    $notify("GKD011 Cookie 抓取失敗", "", String(e));
  }

  $done({});
})();
