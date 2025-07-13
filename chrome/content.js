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

                // Add a settings button with a gear icon to the start of the chat container
                if (
                  chatContainer &&
                  !chatContainer.querySelector(".settings-button")
                ) {
                  var settingsButton = document.createElement("button");
                  settingsButton.classList.add("settings-button", "hs-button");
                  settingsButton.id = "chat-settings-button";
                  settingsButton.innerHTML =
                    '<div class="hs-button__content-container hs-scaleable-content-on-click hs-chat-input-menu__chat-settings-content-container hs-icon-background" style="transform: scale(0.85);"></div>';
                  settingsButton.style.display = "flex";
                  settingsButton.style.alignItems = "center";
                  settingsButton.style.justifyContent = "center";
                  settingsButton.style.backgroundColor = "transparent";
                  settingsButton.style.border = "none";
                  settingsButton.style.borderRadius = "3px";
                  chatContainer.insertBefore(
                    settingsButton,
                    chatContainer.firstChild
                  );

                  // Check if this is a level, death, or game message and hide the button while keeping space
                  var isSystemMessage = node.querySelector('.hs-text--lime') || // level message
                                       node.querySelector('.hs-text--red') ||  // death message
                                       node.querySelector('.hs-text--white'); // game message
                  
                  if (isSystemMessage) {
                    settingsButton.style.visibility = "hidden"; // Hide but keep space
                    settingsButton.style.pointerEvents = "none"; // Disable click events
                  }

                  // Bind click events to prevent default actions such as clicking the gameworld, causing the character to move
                  bindOnClickBlockHsMask(settingsButton, function (e) {
                    // Get the closest chat message container of the clicked settings button
                    var selectedChatMessage = e.target.closest(
                      "div.hs-chat-message-container"
                    );
                    // and create an object containing the username, message, and UTC timestamp in ISO 8601 format
                    var chatMessageData = {
                      username: (() => {
                        const nameElem = selectedChatMessage.querySelector(
                          ".hs-chat-menu__player-name"
                        );
                        let name = nameElem && nameElem.textContent ? nameElem.textContent : "";
                        name = name.length > 0 ? name.slice(0, -1) : name;
                        return sanitizeText(name);
                      })(),
                      message: (() => {
                        const msgElem = selectedChatMessage.querySelector(
                          ".hs-chat-menu__message-text-container"
                        );
                        let msg = msgElem && msgElem.textContent ? msgElem.textContent : "";
                        return sanitizeText(msg);
                      })(),
                      timestamp: new Date().toISOString(),
                    };

                    // Inject modal as a child of the div with the id #hs-screen-mask
                    var screenMask = document.getElementById("hs-screen-mask");
                    if (screenMask) {
                      // Check if a modal is already open and remove it
                      var existingModal = document.getElementById("chat-modal");
                      if (existingModal) {
                        existingModal.parentNode.removeChild(existingModal);
                      }

                      var modal = document.createElement("div");
                      modal.id = "chat-modal";
                      modal.innerHTML = `
                        <div class="hs-menu hs-closeable-menu hs-center-menu hs-center-menu--horizontally-centered hs-center-menu--vertically-centered"
                            id="hs-skill-guide-menu">
                            <div class="hs-menu-header"><span class="hs-menu-header__title">Message Options</span><button
                                    class="hs-button hs-close-button hs-menu-header__close-button hs-image-button" tabindex="-1" id="close-chat-modal">
                                    <div class="hs-button__content-container hs-scaleable-content-on-click hs-image-button__content-container">
                                        <div class="hs-image-button__image hs-icon-background hs-close-button__x hs-close-button__x--white">
                                        </div>
                                    </div>
                                </button></div>
                            <div class="hs-closeable-menu__content-container" id="hs-skill-guide-menu__content-container-chat">
                              <div style="white-space:pre-line; margin-top:3rem; margin-left:2rem; margin-right:2rem;">
                                <div style="margin-bottom:1rem;">Username: ${chatMessageData.username}</div>
                                <div style="margin-bottom:1rem;">Message: ${chatMessageData.message}</div>
                                <div style="margin-bottom:1rem;">Timestamp: ${new Date(chatMessageData.timestamp).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                                <div style="text-align:center; width:100%; margin-top:2rem;">Report for:</div>
                                <div style="display:flex; justify-content:center;">
                                  <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:0.75rem;">
                                    <button class="report-reason-btn" data-reason="Offensive Player" style="border-radius:10px; padding:0.75rem 1rem; cursor:pointer; background:#ffc107; color:#fff; font-weight:bold; border:none;">Offensive Player</button>
                                    <button class="report-reason-btn" data-reason="Harassment" style="border-radius:10px; padding:0.75rem 1rem; cursor:pointer; background:#fd7e14; color:#fff; font-weight:bold; border:none;">Harassment</button>
                                    <button class="report-reason-btn" data-reason="Botting" style="border-radius:10px; padding:0.75rem 1rem; cursor:pointer; background:#dc3545; color:#fff; font-weight:bold; border:none;">Botting</button>
                                    <button class="report-reason-btn" data-reason="Duping" style="border-radius:10px; padding:0.75rem 1rem; cursor:pointer; background:#b71c1c; color:#fff; font-weight:bold; border:none;">Duping</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>
                      `;
                      screenMask.appendChild(modal);

                      // Add report button click handler to send to Discord - future development
                      var reportBtns = modal.querySelectorAll('.report-reason-btn');
                      reportBtns.forEach(function(btn) {
                        btn.addEventListener('click', function(e) {
                          e.preventDefault();
                          e.stopPropagation();
                          var reason = btn.getAttribute('data-reason');
                          var reportData = {
                            username: chatMessageData.username,
                            message: chatMessageData.message,
                            timestamp: chatMessageData.timestamp,
                            reason: reason,
                            reporter: document.querySelector('#hs-chat-input-player-name-and-input-container span').textContent.slice(0, -1)
                          };
                          if (typeof browser !== "undefined" && browser.runtime) {
                            browser.runtime.sendMessage({
                              action: "sendToDiscord",
                              data: reportData,
                            });
                          } else if (typeof chrome !== "undefined" && chrome.runtime) {
                            chrome.runtime.sendMessage({
                              action: "sendToDiscord",
                              data: reportData,
                            });
                          }
                          var contentContainer = modal.querySelector('#hs-skill-guide-menu__content-container-chat');
                          if (contentContainer) {
                            contentContainer.innerHTML = '<div style="white-space:pre-line; margin-top:3rem;"><div style="margin-bottom:3.5rem;">Thank you for your report! :)</div></div>';
                          }
                        });
                      });

                      // Block game movement when interacting with modal
                      function blockEvent(e) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                      ["click", "pointerdown", "pointerup"].forEach(function(evt) {
                        modal.addEventListener(evt, blockEvent);
                      });

                      // Close modal on button click, but also block game movement
                      var closeBtn = modal.querySelector('#close-chat-modal');
                      if (closeBtn) {
                        ["click", "pointerdown", "pointerup"].forEach(function(evt) {
                          closeBtn.addEventListener(evt, blockEvent);
                        });
                        closeBtn.addEventListener('click', function (e) {
                          // Only close on click, but still block movement
                          if (modal.parentNode) {
                            modal.parentNode.removeChild(modal);
                          }
                        });
                      }
                    }
                  });
                }

                // Add timestamp if enabled
                // Use cross-browser compatible API
                const storageAPI = typeof browser !== "undefined" ? browser : chrome;
                storageAPI.storage.sync
                  .get(["timestampActive"])
                  .then(function (data) {
                    // Default to true if not set
                    var timestampActive = !!data.timestampActive;
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
  // Removed unused chatSettings cache and defaultSettings (all settings are handled via cross-browser compatible storage API directly)

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
  // Use cross-browser compatible API
  const storageAPI = typeof browser !== "undefined" ? browser : chrome;
  storageAPI.storage.sync.get([
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
