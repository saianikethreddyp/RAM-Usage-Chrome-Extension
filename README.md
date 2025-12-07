# ⚡ RAM & Permissions Monitor

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/platform-Chrome-googlechrome.svg)

A lightweight, developer-friendly Chrome extension that provides real-time insights into website performance and privacy. It displays **JavaScript Heap memory usage** and **active permissions** (Camera, Microphone, Location, etc.) in a sleek, non-intrusive overlay.

## 🚀 Features

-   **Real-time Memory Tracking**: Monitors `performance.memory.usedJSHeapSize` to show accurate JavaScript memory consumption.
-   **Performance Statistics**:
    -   **FPS Counter**: Real-time Frames Per Second monitoring to spot lag.
    -   **DOM Node Count**: Tracks page complexity by counting total HTML elements.
-   **Visual History**: Click to expand a **Sparkline Graph** showing memory usage trends over time.
-   **Privacy at a Glance**: Instantly visible icons for active permissions (📷 Camera, 🎤 Mic, 📍 Location).
-   **Smart Visuals**:
    -   **Draggable Interface**: Move the overlay anywhere on the screen—it remembers your spot!
    -   **Glassmorphism UI**: Premium, translucent design that blends into any website.
    -   **Dynamic Color Coding**: Green/Orange/Red indicators based on memory load.

## 🛠 Installation

Since this extension is in active development, it is installed via **Developer Mode**:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/saianikethreddyp/RAM-Usage-Chrome-Extension
    ```
2.  **Open Chrome Extensions**
    -   Navigate to `chrome://extensions` in your address bar.
3.  **Enable Developer Mode**
    -   Toggle the switch in the top-right corner.
4.  **Load Unpacked**
    -   Click the **Load unpacked** button.
    -   Select the cloned repository folder.

## 📖 Usage

1.  Open any website (e.g., YouTube, Google Maps).
2.  Look for the overlay in the **bottom-right corner**.
3.  **Interaction**:
    -   **Drag**: Click and hold the header (⚡ icon area) to move the overlay.
    -   **Expand**: Click the header once to toggle the **Memory Graph** and detailed stats (DOM count, Peak Memory).
    -   **Observe**: Watch the FPS counter to gauge page smoothness.
4.  **Permissions**:
    -   If an icon (e.g., 📷) appears, the site has *active access* to that device feature. Hover over the icon for a label.

## 📂 Project Structure

```
├── manifest.json      # Extension configuration (Manifest V3)
├── content.js         # Core logic (DOM injection, Permission API, Memory API)
├── styles.css         # UI styling (Glassmorphism, Animations)
└── README.md          # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
