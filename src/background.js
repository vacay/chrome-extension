/* global chrome */

var chromeRe = /^chrome([^:]+)?:\/\/(.+)?/i;
var vacayRe = /^([^:]+)?:\/\/vacay.io(.+)?/i;

var callback = function(tabId, changeInfo, tab) {

    if (!tab) return;
    if (chromeRe.test(tab.url)) return;
    if (vacayRe.test(tab.url)) return;

    if (tab.status === 'complete')
	chrome.tabs.executeScript(null, { file: 'content.js' });
};

chrome.tabs.onUpdated.addListener(callback);
chrome.tabs.onCreated.addListener(callback);
