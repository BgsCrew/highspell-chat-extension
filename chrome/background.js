// Discord webhook integration
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1393598241836109965/FVz3bKqbJAxs8L5QCoRBpSCHITbO6BXnARsuCxf3Q-skbgiTnDza4bFAy2X23Xue2Rfz";

// Use cross-browser compatible API
const runtimeAPI = typeof browser !== "undefined" ? browser : chrome;

runtimeAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
