export function getUserAgentInfo() {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const data = {};

  if (userAgent.includes("Firefox")) {
    data.browser = "Firefox";
  } else if (userAgent.includes("Edg")) {
    data.browser = "Microsoft Edge";
  } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    data.browser = "Chrome";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    data.browser = "Safari";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    data.browser = "Opera";
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
    data.browser = "Internet Explorer";
  } else {
    data.browser = "Unknown";
  }

  if (userAgent.includes("Windows NT")) {
    data.os = "Windows";
  } else if (userAgent.includes("Mac OS X")) {
    data.os = "MacOS";
  } else if (userAgent.includes("Linux")) {
    data.os = "Linux";
  } else if (userAgent.includes("Android")) {
    data.os = "Android";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    data.os = "iOS";
  } else {
    data.os = "Unknown";
  }

  if (/Mobi|Android/i.test(userAgent)) {
    data.device = "Mobile";
  } else if (/iPad|Tablet/i.test(userAgent)) {
    data.device = "Tablet";
  } else {
    data.device = "Desktop";
  }

  return {
    userAgent,
    platform,
    ...data
  };
}

