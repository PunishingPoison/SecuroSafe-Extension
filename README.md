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

🚀 Getting Started: Installation Guide
Follow these steps to get SecuroSafe running on your local machine for development and testing.

Prerequisites
Node.js (which includes npm) installed on your computer.

A Google Account for Firebase and Google Cloud services.

Step 1: Clone the Repository
First, download the project files to your computer using Git:

git clone [https://github.com/your-username/securosafe-extension.git](https://github.com/your-username/securosafe-extension.git)
cd securosafe-extension

Step 2: Load the Extension in Chrome
Create Placeholder Icons: This project requires icon files to be present. In the project's root directory, create a folder named icons and place three blank PNG images inside it with these exact names:

icon16.png

icon48.png

icon128.png

Open Google Chrome and navigate to chrome://extensions.

Enable Developer mode using the toggle switch in the top-right corner.

Click the "Load unpacked" button.

Select the securosafe-extension folder that you just cloned.

The SecuroSafe icon should now appear in your Chrome toolbar. At this point, it will run in demo mode with mock data.

Step 3: API Configuration (To Enable Live Features)
To unlock the full functionality, you need to connect the extension to its backend services.

Part A: Google Safe Browsing API
Navigate to the Google Cloud Console and create a new project.

In the navigation menu, go to "APIs & Services" > "Library".

Search for and enable the Safe Browsing API.

Go to "Credentials", click "+ CREATE CREDENTIALS", and select "API key".

Copy the generated API key.

Open the background.js file and replace the placeholder string 'YOUR_GOOGLE_SAFE_BROWSING_API_KEY' with your new key.

Part B: Firebase Cloud Function & Gemini API
This backend function powers the on-demand text analysis.

Create a Firebase Project: Go to the Firebase Console and create a new project.

Get a Gemini API Key: Visit Google AI Studio to create and copy your Gemini API key.

Set up the Firebase CLI:

Install the Firebase tools globally: npm install -g firebase-tools

Log in to your Google account: firebase login

Initialize Firebase Functions:

Create a new folder outside of your extension directory (e.g., securosafe-backend) and navigate into it.

Run the command: firebase init functions

Follow the prompts:

Use an existing project -> Select your new Firebase project.

Language -> JavaScript.

Use ESLint? -> Your choice (Yes is recommended).

Install dependencies? -> Yes.

Add Function Code:

This will create a functions folder. Inside it, open index.js and replace its entire content with the code from the Firebase Cloud Function/index.js file in this repository.

Install the required dependency: cd functions and run npm install google-auth-library.

Set Your API Key Securely:

From inside the functions directory, run:

firebase functions:secrets:set GEMINI_API_KEY

Paste your Gemini API key when prompted.

Deploy the Function:

Navigate back to your backend project's root folder (securosafe-backend).

Run the deployment command:

firebase deploy --only functions

Connect the Frontend: After deployment, the terminal will provide a Function URL. Copy this URL. Open the popup.js file in your extension folder and replace 'YOUR_FIREBASE_CLOUD_FUNCTION_URL' with the URL you copied.

Reload the Extension: Go back to chrome://extensions and click the refresh button on the SecuroSafe card to apply all your changes.

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
