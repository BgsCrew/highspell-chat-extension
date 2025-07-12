document.addEventListener('DOMContentLoaded', function() {
  // Default colors and enabled states for each type
  const defaults = {
    globalChatColour: '#ffa500',
    globalChatColourEnabled: false,
    privateMessageColour: '#00ffff',
    privateMessageColourEnabled: false,
    levelMessageColour: '#00ff00',
    levelMessageColourEnabled: false,
    deathMessageColour: '#ff0000',
    deathMessageColourEnabled: false,
    gameMessageColour: '#ffffff',
    gameMessageColourEnabled: false,
    localMessageColour: '#ffff00',
    localMessageColourEnabled: false,
  };

  // Helper to set enabled/disabled state and style
  function setEnabledState(key, enabled) {
    const colorInput = document.getElementById(key.replace('Enabled', ''));
    colorInput.disabled = !enabled;
    if (!enabled) {
      colorInput.style.opacity = '0.5';
      colorInput.style.pointerEvents = 'none';
      colorInput.style.filter = 'grayscale(100%)';
    } else {
      colorInput.style.opacity = '1';
      colorInput.style.pointerEvents = '';
      colorInput.style.filter = '';
    }
  }

  // Load saved colors and enabled states,
  browser.storage.sync.get(Object.keys(defaults)).then(function(data) {
    Object.keys(defaults).forEach(function(key) {
      if (key.endsWith('Enabled')) {
        const enabled = data[key] || false;
        document.getElementById(key).checked = enabled;
        setEnabledState(key, enabled);
      } else {
        document.getElementById(key).value = data[key] || defaults[key];
      }
    });
  });

  // Save color and enabled state
  Object.keys(defaults).forEach(function(key) {
    if (key.endsWith('Enabled')) {
      document.getElementById(key).addEventListener('change', function() {
        browser.storage.sync.set({ [key]: this.checked });
        setEnabledState(key, this.checked);
      });
    } else {
      document.getElementById(key).addEventListener('change', function() {
        browser.storage.sync.set({ [key]: this.value });
      });
    }
  });
});
