/* global chrome */

var chromeRe = /^chrome([^:]+)?:\/\/(.+)?/i;
var tabs = {};

var callback = function(tabId, changeInfo, tab) {
    console.debug(tab);
    console.debug(changeInfo);

    if (!tab) return;

    if (chromeRe.test(tab.url)) return;

    if (tab.status === 'complete') {

        if (tabs[tabId] === tab.url) return;
        tabs[tabId] = tab.url;

        chrome.tabs.executeScript(null, { file: 'axios.standalone.min.js' }, function() {
            chrome.tabs.executeScript(null, { file: 'content.js' });
        });
    }
};

chrome.tabs.onUpdated.addListener(callback);
chrome.tabs.onCreated.addListener(callback);
