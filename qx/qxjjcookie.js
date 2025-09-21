/*
 * 原創於坤離，任何疑問參考：https://kunlineaten.notion.site

[rewrite_local]
^http:\/\/app\.jjwxc\.org\/newWelfareIos\/executeExchange\?identification  url script-request-header https://raw.githubusercontent.com/Kunlineaten/Task/jj/qx/qxjjcookie.js

[mitm]
hostname = app.jjwxc.org, app.jjwxc.net
*/

function findKeyLike(obj, keyword) {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const value = obj[key];
    if (key.toLowerCase().includes(keyword.toLowerCase()) && typeof value === 'string') {
      return value;
    }
    if (typeof value === 'object' && value !== null) {
      const nested = findKeyLike(value, keyword);
      if (nested) return nested;
    }
  }
  return null;
}

try {
  if ($request?.url?.includes("executeExchange")) {
    const idMatch = $request.url.match(/[?&]identification=([^&]+)/);
    if (idMatch && idMatch[1]) {
      const identification = decodeURIComponent(idMatch[1]);
      $prefs.setValueForKey(identification, "JJ_IDENTIFICATION");
      console.log("✅ IDENTIFICATION 已保存：" + identification);
      $notify("✅ IDENTIFICATION 提取成功", "", identification);
    } else {
      console.log("❌ 无法提取 identification");
    }

    const signMatch = $request.url.match(/[?&]sign=([^&]+)/i);
    if (signMatch && signMatch[1]) {
      const aSIGN = decodeURIComponent(signMatch[1]);
      $prefs.setValueForKey(aSIGN, "JJ_aSIGN");
      console.log("✅ aSIGN 已保存：" + aSIGN);
      $notify("✅ aSIGN 提取成功", "", aSIGN);
    } else {
      console.log("❌ 无法提取 sign");
    }
  } else {
    console.log("⚠️ 非 executeExchange 请求，跳过提取");
  }

  if ($request?.headers) {
    const headers = $request.headers;
    const UA = headers["User-Agent"] || headers["user-agent"] || "";
    const APPDEVICE = headers["APPDEVICE"] || headers["appdevice"] || "";
    const SMDeviceID = headers["SMDeviceID"] || headers["smdeviceid"] || "";
    const READERID = headers["READERID"] || headers["readerid"] || "";
    const SIGN = headers["SIGN"] || headers["sign"] || "";

    if (UA) $prefs.setValueForKey(UA, "JJ_UA");
    if (APPDEVICE) $prefs.setValueForKey(APPDEVICE, "JJ_APPDEVICE");
    if (SMDeviceID) $prefs.setValueForKey(SMDeviceID, "JJ_SMDeviceID");
    if (READERID) $prefs.setValueForKey(READERID, "JJ_READERID");
    if (SIGN) $prefs.setValueForKey(SIGN, "JJ_SIGN");

    console.log("✅ UA: " + UA);
    console.log("✅ APPDEVICE: " + APPDEVICE);
    console.log("✅ SMDeviceID: " + SMDeviceID);
    console.log("✅ READERID: " + READERID);
    console.log("✅ SIGN: " + SIGN);
    $notify("✅ 提取成功", "", UA/APPDEVICE/SMDeviceID/READERID/SIGN);
  } else {
    console.log("⚠️ 没有可提取");
  }

} catch (e) {
  console.log("❌ 提取错误：" + e);
}

$done({});
