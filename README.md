# Highspell Chat Extension

A powerful browser extension for the MMORPG **Highspell** that enhances the chat experience with quality-of-life features, item linking, timestamps, message customization, and easy reporting functionality.

![Extension Features](https://img.shields.io/badge/Features-Chat_Enhancement-blue)
![Browser Support](https://img.shields.io/badge/Browsers-Chrome%20|%20Firefox-green)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## ⬇️ Extension Store Links

### Chrome: https://chromewebstore.google.com/detail/highspell-chat-extension/gifkjjhmmgfbifdjkcgfopikkkblhnei?authuser=1&hl=en-GB

### Firefox: Awaiting approval...

## 🚀 Installation Instructions

### Chrome Installation (Sideloading)

1. **Download the Extension**
   - Download this repository as a ZIP file or clone it:
     ```bash
     git clone https://github.com/BgsCrew/highspell-chat-extension.git
     ```

2. **Open Chrome Extensions Page**
   - Open Chrome browser
   - Navigate to `chrome://extensions/` or go to Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to the downloaded folder and select the `chrome/` directory
   - Click "Select Folder"

5. **Verify Installation**
   - The extension should now appear in your extensions list
   - You should see the Highspell Chat Extension icon in your browser toolbar

### Firefox Installation (Sideloading)

1. **Download the Extension**
   - Download this repository as a ZIP file or clone it:
     ```bash
     git clone https://github.com/BgsCrew/highspell-chat-extension.git
     ```

2. **Open Firefox Add-ons Page**
   - Open Firefox browser
   - Navigate to `about:debugging` or go to Menu → Web Developer → Browser Toolbox

3. **Access This Firefox**
   - Click on "This Firefox" in the left sidebar

4. **Load Temporary Add-on**
   - Click "Load Temporary Add-on..." button
   - Navigate to the downloaded folder and select the `firefox/manifest.json` file
   - Click "Open"

5. **Verify Installation**
   - The extension should now appear in your temporary extensions
   - Note: Firefox temporary extensions are removed when you restart the browser

### 📝 Alternative Firefox Installation (Permanent)

For a more permanent Firefox installation:

1. **Create a ZIP file**
   - Compress the contents of the `firefox/` folder into a ZIP file
   
2. **Install from File**
   - Go to `about:addons`
   - Click the gear icon and select "Install Add-on From File..."
   - Select your ZIP file

## ✨ Features

### 🔗 Item Replacement System
- **Smart Item Linking**: Automatically converts item IDs in square brackets (e.g., `[6]`, `[40]`) to item names (`[Coins]`, `[Bronze Chestplate]`)
- **500+ Items Supported**: Comprehensive database of Highspell items including weapons, armor, consumables, and resources
- **Real-time Processing**: Works on all incoming chat messages across all chat channels

### ⏰ Timestamp Feature
- **Configurable Timestamps**: Add `[HH:MM]` timestamps to all chat messages
- **Local Time Display**: Shows messages in your local timezone
- **Toggle Option**: Can be enabled/disabled through the settings panel

### 🎨 Message Customization
- **Color Customization**: Change colors for different message types:
  - Local Messages (Yellow)
  - Global Messages (Orange)  
  - Private Messages (Cyan)
  - Level Messages (Green)
  - Death Messages (Red)
  - Game Messages (White)
- **Message Hiding**: Completely hide specific message types you don't want to see
- **Per-Type Control**: Individual enable/disable toggles for each message type

### ⚙️ Settings Panel
- **Easy Configuration**: User-friendly settings interface
- **Color Picker**: Visual color selection for message types
- **Instant Preview**: Changes apply immediately without restart
- **Cross-Browser Sync**: Settings synchronized across browser sessions

## 🎮 Usage

1. **Navigate to Highspell**
   - Go to the Highspell game website
   - Log into your account

2. **Extension Auto-Activation**
   - The extension automatically activates when it detects the chat system
   - Look for the console message: "Highspell Chat Extension loaded..."

3. **Access Settings**
   - Click the extension icon in your browser toolbar
   - Or right-click the extension icon and select "Options"

4. **Test Item Replacement**
   - Type a message with item IDs: "I have [6] and need [40]"
   - Watch it transform to: "I have [Coins] and need [Bronze Chestplate]"

## 🛠️ Technical Details

### Architecture
- **Manifest V3**: Modern extension architecture for Chrome
- **Cross-Browser Compatible**: Separate builds for Chrome and Firefox
- **MutationObserver**: Real-time chat message detection
- **jQuery Integration**: Smooth DOM manipulation
- **Storage API**: Persistent settings across sessions

### File Structure
```
├── chrome/                 # Chrome extension files
│   ├── manifest.json      # Chrome manifest
│   ├── content.js         # Main content script
│   ├── background.js      # Service worker
│   ├── settings.html      # Settings interface
│   ├── settings.js        # Settings logic
│   └── highspell-items.json # Item database
├── firefox/               # Firefox extension files
│   ├── manifest.json      # Firefox manifest
│   ├── content.js         # Main content script
│   ├── background.js      # Background script
│   ├── settings.html      # Settings interface
│   ├── settings.js        # Settings logic
│   └── highspell-items.json # Item database
└── README.md             # This file
```

### Item Database
- **507 Items**: Complete item database from ID 1-507
- **Categories**: Fishing, Combat, Armor, Tools, Consumables, Resources
- **Auto-Update Ready**: Easy to expand with new items
- **JSON Format**: Structured data for fast lookups

## 🔧 Development

### Prerequisites
- Basic knowledge of JavaScript
- Browser extension development familiarity
- Code editor (VS Code recommended)

### Making Changes
1. **Modify Source Files**: Edit files in `chrome/` or `firefox/` directories
2. **Reload Extension**: 
   - Chrome: Go to `chrome://extensions/` and click reload
   - Firefox: Go to `about:debugging` and reload the temporary add-on
3. **Test Changes**: Refresh the Highspell game page

### Adding New Items
1. **Update Item Database**: Edit `highspell-items.json` in both directories
2. **Format**: `"ID": "Item Name"`
3. **Example**: `"508": "New Legendary Sword"`

## 🤝 Contributing

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Implement your improvements
4. **Test Thoroughly**: Verify in both Chrome and Firefox
5. **Submit Pull Request**: Describe your changes clearly

## 📋 Changelog

### Version 1.0.0
- Initial release
- Item replacement system with 507+ items
- Configurable timestamps
- Message color customization
- Message hiding functionality
- Cross-browser compatibility
- Settings panel interface

## 🐛 Known Issues

- Firefox temporary extensions require reinstallation after browser restart
- Some complex item names may need escaping for special characters
- Extension requires page refresh if chat system loads after extension

## 📞 Support

- **Issues**: Report bugs via GitHub Issues
- **Questions**: Contact the development team
- **Game**: Visit [Highspell Official Website](https://highspell.com)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Credits

**Developed by Zora** with a lot of vibecoding! 💜

Enjoy enhanced chatting in Highspell! 🎮✨
