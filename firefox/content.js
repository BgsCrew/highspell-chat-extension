// Developed by Zora! <3
$(document).ready(function () {
  console.log(
    "Highspell Chat Extension loaded, developed by Zora with a lot of vibecoding. Have fun!"
  );
  // Extension loaded log (optional for debugging, can be removed for production)

  // Prevent default actions for clicks on the chat menu section, for use in not have the character move when clicking a <button>
  function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Bind click events to prevent default actions such as clicking the gameworld, causing the character to move
  function bindOnClickBlockHsMask(element, callback) {
    element.addEventListener("click", (e) => {
      callback(e);
      preventDefault(e);
    });
    element.addEventListener("pointerdown", preventDefault);
    element.addEventListener("pointerup", preventDefault);
  }

  // Set up a MutationObserver to watch for changes in the chat menu section of the DOM
  function setupObserver() {
    var $chatMenuSection = $("#hs-chat-menu-section-container");
    if ($chatMenuSection.length) {
      console.log("Chat menu section found, setting up observer...");

      // Create a MutationObserver
      var observer = new MutationObserver(function (mutationsList, observer) {
        mutationsList.forEach(function (mutation) {
          // Only process mutations where child nodes are added
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(function (node) {
              // Only process element nodes
              if (node.nodeType === 1) {
                // Find the closest parent list container, then its first div child, being the chat container.
                // This contains children of the timestamp (if enabled), the chat users name, and the chat message.
                var listContainer = node.closest("li");
                var chatContainer = listContainer
                  ? listContainer.querySelector("div")
                  : null;

                // Add timestamp if enabled
                browser.storage.sync
                  .get(["timestampActive"])
                  .then(function (data) {
                    // Default to false if not set
                    var timestampActive = data.timestampActive !== undefined ? data.timestampActive : false;
                    var settingsButton = chatContainer
                      ? chatContainer.querySelector(".settings-button")
                      : null;
                    // generate a timestamp in the users local time in the format of "[HH:MM]"
                    var timestamp = new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    // Insert timestamp after settings button, or as first child if settings button doesn't exist
                    if (
                      timestampActive &&
                      chatContainer &&
                      !chatContainer.querySelector(".timestamp")
                    ) {
                      var timestampSpan = document.createElement("span");
                      timestampSpan.classList.add(
                        "hs-text--white",
                        "timestamp"
                      );
                      timestampSpan.textContent = "[" + timestamp + "]\u00A0";
                      if (settingsButton && settingsButton.nextSibling) {
                        chatContainer.insertBefore(
                          timestampSpan,
                          settingsButton.nextSibling
                        );
                      } else if (settingsButton) {
                        chatContainer.appendChild(timestampSpan);
                      } else {
                        chatContainer.insertBefore(
                          timestampSpan,
                          chatContainer.firstChild
                        );
                      }
                    }
                  });

                // List of chat message classes and their types
                var chatClasses = {
                  "hs-text--cyan": "privateMessage",
                  "hs-text--lime": "levelMessage",
                  "hs-text--orange": "globalMessage",
                  "hs-text--red": "deathMessage",
                  "hs-text--white": "gameMessage",
                  "hs-text--yellow": "localMessage",
                };

                // For each class, find elements and call the corresponding function
                Object.keys(chatClasses).forEach(function (className) {
                  var $elements = $(node)
                    .find("." + className)
                    .addBack("." + className);
                  $elements.each(function () {
                    switch (className) {
                      case "hs-text--cyan":
                        handlePrivateMessage(this);
                        break;
                      case "hs-text--lime":
                        handleLevelMessage(this);
                        break;
                      case "hs-text--red":
                        handleDeathMessage(this);
                        break;
                      case "hs-text--white":
                        handleGameMessage(this);
                        break;
                      case "hs-text--yellow":
                        handleLocalMessage(this);
                        break;
                      case "hs-text--orange":
                        handleGlobalMessage(this);
                        break;
                    }
                  });
                });
              }
            });
          }
        });
      });

      // Start observing for child additions, subtree changes, and attribute changes
      observer.observe($chatMenuSection[0], {
        childList: true,
        subtree: true,
        attributes: true,
      });

      // Store the observer instance in a global variable for later use
      window.chatObserver = observer;
    } else {
      // If chat menu section not found, retry after 500ms
      setTimeout(setupObserver, 500);
    }
  }

  // Automatically restart observer when chat menu section is re-added (e.g., after login)
  function setupAutoResync() {
    var targetNode = document.body;
    var lastChatMenuPresent = false;
    var autoResyncObserver = new MutationObserver(function (mutationsList) {
      var chatMenuSection = document.getElementById(
        "hs-chat-menu-section-container"
      );
      var chatMenuPresent = !!chatMenuSection;
      if (chatMenuPresent && !lastChatMenuPresent) {
        // Chat menu section was just added
        setupObserver();
      } else if (!chatMenuPresent && lastChatMenuPresent) {
        // Chat menu section was just removed
        if (
          window.chatObserver &&
          typeof window.chatObserver.disconnect === "function"
        ) {
          window.chatObserver.disconnect();
        }
        window.chatObserver = null;
      }
      lastChatMenuPresent = chatMenuPresent;
    });
    autoResyncObserver.observe(targetNode, {
      childList: true,
      subtree: true,
    });
    window.autoResyncObserver = autoResyncObserver;
  }

  // Start both observers
  setupObserver();
  setupAutoResync();

  // ...existing code...
});

// Cache for settings
  // Removed unused chatSettings cache and defaultSettings (all settings are handled via browser.storage.sync directly)

// Helper function to set CSS properties with !important
function setProperty(element, property, value, important = true) {
  if (element && element.style) {
    element.style.setProperty(
      property,
      value,
      important ? "important" : undefined
    );
  }
}

// Sanitize text to prevent XSS
function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/[&<>"]/g, function (c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
  });
}

// Generic handler for chat messages
function handleChatMessage(element, options) {
  if (!element) return;
  browser.storage.sync.get([
    options.colourKey,
    options.colourEnabledKey,
    options.hideKey
  ]).then(function (data) {
    if (data[options.hideKey]) {
      const parent = element.parentElement;
      if (parent) {
        setProperty(parent, "display", "none");
      }
      return;
    }
    if (data[options.colourEnabledKey]) {
      setProperty(element, "color", data[options.colourKey] || options.defaultColour);
    }
  });
}
// Update handler functions to use setProperty
function handlePrivateMessage(element) {
  handleChatMessage(element, {
    colourKey: "privateMessageColour",
    colourEnabledKey: "privateMessageColourEnabled",
    hideKey: "hidePrivateMessage",
    defaultColour: "#00ffff"
  });
}

function handleLevelMessage(element) {
  handleChatMessage(element, {
    colourKey: "levelMessageColour",
    colourEnabledKey: "levelMessageColourEnabled",
    hideKey: "hideLevelMessage",
    defaultColour: "#00ff00"
  });
}

function handleGlobalMessage(element) {
  handleChatMessage(element, {
    colourKey: "globalChatColour",
    colourEnabledKey: "globalChatColourEnabled",
    hideKey: "hideGlobalChat",
    defaultColour: "#ffa500"
  });
}

function handleDeathMessage(element) {
  handleChatMessage(element, {
    colourKey: "deathMessageColour",
    colourEnabledKey: "deathMessageColourEnabled",
    hideKey: "hideDeathMessage",
    defaultColour: "#ff0000"
  });
}

function handleGameMessage(element) {
  handleChatMessage(element, {
    colourKey: "gameMessageColour",
    colourEnabledKey: "gameMessageColourEnabled",
    hideKey: "hideGameMessage",
    defaultColour: "#ffffff"
  });
}

function handleLocalMessage(element) {
  handleChatMessage(element, {
    colourKey: "localMessageColour",
    colourEnabledKey: "localMessageColourEnabled",
    hideKey: "hideLocalMessage",
    defaultColour: "#ffff00"
  });
}
