chrome.action.onClicked.addListener((tab) => {

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["jquery-3.7.1.slim.min.js"]
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});

// Discord webhook integration
// TODO: REWRITE TO POST TO API ENDPOINT TO HANDLE PARSING AND RATE LIMITING
// This code should not currently be reachable as the buttons to call it are in another branch. Will throw an error if called due to no defined webhook url.
const DISCORD_WEBHOOK_URL = "";

if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendToDiscord" && request.data) {
      // Format timestamp for Discord local time
      let unix = null;
      if (request.data.timestamp) {
        unix = Math.floor(new Date(request.data.timestamp).getTime() / 1000);
      }
      const payload = {
        embeds: [
          {
            title: "🚨 Highspell Chat Report",
            color: 15158332, // Red
            fields: [
              { name: "Reporter", value: request.data.reporter, inline: true },
              { name: "Reason", value: request.data.reason, inline: true },
              { name: "Username", value: request.data.username, inline: true },
              { name: "Message", value: request.data.message },
              { name: "Reported At", value: unix ? `<t:${unix}:F>` : request.data.timestamp, inline: false }
            ],
            footer: { text: "Source: Highspell Chat Browser Extension" }
          }
        ]
      };
      fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      .then(response => sendResponse({ status: response.status }))
      .catch(error => sendResponse({ status: "error", error: error.toString() }));
      return true;
    }
  });
}
