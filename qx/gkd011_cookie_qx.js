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

    const secFetchDest = (headers["Sec-Fetch-Dest"] || headers["sec-fetch-dest"] || "").toLowerCase();
    const accept = (headers["Accept"] || headers["accept"] || "").toLowerCase();
    const isSubResource = secFetchDest && secFetchDest !== "document";

    // 常見靜態資源（子資源）直接略過，避免誤報問題
    if (isSubResource || /\.(js|css|png|jpe?g|gif|svg|ico|woff2?|ttf)(\?|$)/i.test(url)) {
      console.log("↪️ 子資源請求，跳過 Cookie 抓取: " + url);
      return $done({});
    }

    // 僅在主頁/HTML 或常見登入相關路徑嘗試抓 Cookie
    const likelyLoginOrPage =
      accept.includes("text/html") ||
      /login|signin|auth|member|user|account/i.test(url);

    if (!likelyLoginOrPage) {
      console.log("↪️ 非登入相關請求，跳過: " + url);
      return $done({});
    }

    const cookie = headers.Cookie || headers.cookie || "";
    if (!cookie) {
      console.log("⚠️ 此請求沒有 Cookie，略過: " + url);
      return $done({});
    }

    const oldCookie = $prefs.valueForKey("GKD011_COOKIE") || "";
    if (oldCookie === cookie) {
      console.log("ℹ️ Cookie 未變更，略過通知");
      return $done({});
    }

    $prefs.setValueForKey(cookie, "GKD011_COOKIE");
    console.log("✅ GKD011_COOKIE 已更新");
    $notify("GKD011 Cookie 抓取成功", "", "已寫入 GKD011_COOKIE（已過濾子資源）");
  } catch (e) {
    console.log("❌ Cookie 抓取失敗: " + e);
    $notify("GKD011 Cookie 抓取失敗", "", String(e));
  }

  $done({});
})();
