/*
* 原創於坤離，任何疑問參考：https://kunlineaten.notion.site
 */
if ($request && $request.url.includes("executeExchange")) {
  const idMatch = $request.url.match(/[?&]identification=([^&]+)/);
  const signMatch = $request.url.match(/[?&]sign=([^&]+)/);

  if (idMatch) {
    $persistentStore.write(decodeURIComponent(idMatch[1]), "JJ_IDENTIFICATION");
  }

  if (signMatch) {
    $persistentStore.write(decodeURIComponent(signMatch[1]), "JJ_aSIGN");
  }

  const headers = $request.headers;
  if (headers) {
    $persistentStore.write(headers["User-Agent"] || headers["user-agent"], "JJ_UA");
    $persistentStore.write(headers["APPDEVICE"] || headers["appdevice"], "JJ_APPDEVICE");
    $persistentStore.write(headers["SMDeviceID"] || headers["smdeviceid"], "JJ_SMDeviceID");
    $persistentStore.write(headers["READERID"] || headers["readerid"], "JJ_READERID");
    $persistentStore.write(headers["SIGN"] || headers["sign"], "JJ_SIGN");
    
    $notification.post("✅ 提取成功", "", "所有参数已保存");
  }
}

$done({});
