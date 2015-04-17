var tabMaps = {};
var blockedDomains = ["*://*.facebook.com/*"];

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if(typeof(tab.url)=="undefined" || !tab.url) return;
  tabMaps[tabId] = tab.url;
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details){
    var vl = false;
    if(details.tabId!=-1 && typeof(tabMaps[details.tabId])!="undefined"){
      for(var i=0;i<blockedDomains.length;++i){
        var reg = new RegExp(blockedDomains[i].replace(/\*/g,".*"));
        console.log(details.tabId);
        console.log(tabMaps[details.tabId]);
        console.log(details.url);
        console.log(!reg.test(tabMaps[details.tabId]));
        console.log(reg.test(details.url));
        if ( !reg.test(tabMaps[details.tabId]) && reg.test(details.url) ){
          vl = true;
          break;
        }
      }
    }
    return {cancel:vl};
  }, {"urls": blockedDomains}, ["blocking"]
);
