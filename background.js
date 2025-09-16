const SAFE_BROWSING_API_KEY = 'YOUR_SAFE_BROWSING_API_KEY';
const SAFE_BROWSING_API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_API_KEY}`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkUrl') {
    checkUrlWithSafeBrowsing(request.url)
      .then(result => {
        sendResponse({ status: 'success', result });
      })
      .catch(error => {
        sendResponse({ status: 'error', error: error.message });
      });
    return true;
  }
});

/**
 * Checks a URL against the Google Safe Browsing API.
 * @param {string} url The URL to check.
 * @returns {Promise<object>} A promise that resolves with the API result.
 */
async function checkUrlWithSafeBrowsing(url) {
  if (SAFE_BROWSING_API_KEY === 'YOUR_SAFE_BROWSING_API_KEY') {
    console.log("Safe Browsing API key not found. Returning mock data.");
    return Promise.resolve({ matches: [] }); 
  }


  try {
    const response = await fetch(SAFE_BROWSING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client: {
          clientId: 'infoshield-extension',
          clientVersion: '1.0.0',
        },
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION',
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url: url }],
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Safe Browsing API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking URL with Safe Browsing:', error);
    return { error: 'API_REQUEST_FAILED', details: error.message };
  }
}

function showEducationalNotification(title, message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: title,
        message: message,
        priority: 2
    });
}


// Listen for tab updates to trigger automatic scans if enabled
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Ensure the tab is fully loaded and has a URL
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
        chrome.storage.sync.get(['autoCheckEnabled'], (result) => {
            if (result.autoCheckEnabled) {
                checkUrlWithSafeBrowsing(tab.url).then(data => {
                    if (data.matches && data.matches.length > 0) {
                        showEducationalNotification(
                            'InfoShield Alert',
                            'This site was flagged by a safety scanner. Click the InfoShield icon to learn more about what this means.'
                        );
                        // To show a warning icon, create 'icon_warning128.png' in the icons folder
                        // and uncomment the line below.
                        // chrome.action.setIcon({ path: "icons/icon_warning128.png", tabId: tabId });
                    } else {
                         chrome.action.setIcon({ path: "icons/icon128.png", tabId: tabId });
                    }
                });
            }
        });
    }

});
