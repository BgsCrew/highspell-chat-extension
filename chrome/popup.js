document.addEventListener('DOMContentLoaded', function() {
  console.log("Popup loaded");
  // Use cross-browser compatible API
  const storageAPI = typeof browser !== "undefined" ? browser : chrome;
  
  // Load settings from storage
  storageAPI.storage.sync.get([
    'timestampActive',
    'hideGlobalChat',
    'hidePrivateMessage',
    'hideLevelMessage',
    'hideDeathMessage',
    'hideGameMessage',
    'hideLocalMessage'
  ]).then(function(data) {
    document.getElementById('timestampActive').checked = !!data.timestampActive;
    document.getElementById('hideGlobalChat').checked = !!data.hideGlobalChat;
    document.getElementById('hidePrivateMessage').checked = !!data.hidePrivateMessage;
    document.getElementById('hideLevelMessage').checked = !!data.hideLevelMessage;
    document.getElementById('hideDeathMessage').checked = !!data.hideDeathMessage;
    document.getElementById('hideGameMessage').checked = !!data.hideGameMessage;
    document.getElementById('hideLocalMessage').checked = !!data.hideLocalMessage;
  });

  // Save settings on change
  document.getElementById('timestampActive').addEventListener('change', function() {
    storageAPI.storage.sync.set({ timestampActive: this.checked });
  });
  document.getElementById('hideGlobalChat').addEventListener('change', function() {
    storageAPI.storage.sync.set({ hideGlobalChat: this.checked });
  });
  document.getElementById('hidePrivateMessage').addEventListener('change', function() {
    storageAPI.storage.sync.set({ hidePrivateMessage: this.checked });
  });
  document.getElementById('hideLevelMessage').addEventListener('change', function() {
    storageAPI.storage.sync.set({ hideLevelMessage: this.checked });
  });
  document.getElementById('hideDeathMessage').addEventListener('change', function() {
    storageAPI.storage.sync.set({ hideDeathMessage: this.checked });
  });
  document.getElementById('hideGameMessage').addEventListener('change', function() {
    storageAPI.storage.sync.set({ hideGameMessage: this.checked });
  });
  document.getElementById('hideLocalMessage').addEventListener('change', function() {
    storageAPI.storage.sync.set({ hideLocalMessage: this.checked });
  });

  // Open settings page for color selection
  document.getElementById('openSettings').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('settings.html');
    }
  });

  // ...existing code...
});
