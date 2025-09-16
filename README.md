SecuroSafe: An Educational Chrome Extension for Online Credibility
SecuroSafe is a Manifest V3 Chrome extension that acts as an educational assistant to help you navigate the complexities of online information. Rather than blocking content, it provides insights and learning tips about the websites you visit and the links you read, empowering you to make your own informed judgments about credibility and online safety.

✨ Core Features
🛡️ Automatic Site Scanning: Automatically checks websites against Google's Safe Browsing list to highlight known potential risks in a non-intrusive way.

🔍 On-Demand Content Analysis: Paste any headline, text snippet, or URL into the extension to get an AI-powered credibility analysis that spots common misinformation tactics.

🎓 Educational Reports: Receive easy-to-understand reports with a summary, an educational credibility score, and actionable tips for verifying information yourself.

⚙️ User-Controlled & Private: You are in control. Automatic scanning is optional, and on-demand analysis only sends the content you provide. Your browsing history is never stored or tracked.

📸 Screenshots
The SecuroSafe popup providing an educational analysis of a user-submitted headline.

The clean and simple options page to manage your preferences.

📂 Project Structure
/
|-- icons/                  # Extension icons (16x16, 48x48, 128x128)
|-- manifest.json           # Core extension configuration file
|-- background.js           # Service worker for background tasks (e.g., API calls)
|-- content_script.js       # Injected into web pages to extract metadata
|-- popup.html              # The HTML structure for the extension popup
|-- popup.js                # The logic and interactivity for the popup
|-- popup.css               # The styling for the popup
|-- options.html            # The HTML for the settings page
|-- options.js              # The logic for the settings page
|-- options.css             # The styling for the settings page
|-- README.md               # This file
|-- Firebase Cloud Function/
|   |-- index.js            # Node.js code for the backend analysis function
