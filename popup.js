document.addEventListener('DOMContentLoaded', () => {
  const analyzeButton = document.getElementById('analyze-button');
  const textInput = document.getElementById('text-input');
  const analysisResultDiv = document.getElementById('analysis-result');
  const safeBrowsingResultDiv = document.getElementById('safe-browsing-result');
  const pageInfoDiv = document.getElementById('page-info');
  const loader = document.getElementById('loader');
  const CLOUD_FUNCTION_URL = 'YOUR_FIREBASE_CLOUD_FUNCTION_URL';

  function analyzeCurrentPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.url && currentTab.url.startsWith('http')) {
        pageInfoDiv.innerHTML = `<p><strong>URL:</strong> ${new URL(currentTab.url).hostname}</p>`;
        
        safeBrowsingResultDiv.style.display = 'none';
        loader.style.display = 'block';

        chrome.runtime.sendMessage({ action: 'checkUrl', url: currentTab.url }, (response) => {
          loader.style.display = 'none';
          safeBrowsingResultDiv.style.display = 'block';

          if (response && response.status === 'success') {
            displaySafeBrowsingResults(response.result);
          } else {
            safeBrowsingResultDiv.innerHTML = `<h3>Safety Scan Result</h3><p>Could not get a result. This might be due to a network issue or an invalid API key.</p>`;
            safeBrowsingResultDiv.className = 'result-box warning';
          }
        });
      } else {
        pageInfoDiv.innerHTML = `<p>This page cannot be analyzed (e.g., a new tab page or a local file).</p>`;
      }
    });
  }

  function displaySafeBrowsingResults(data) {
    if (data.matches && data.matches.length > 0) {
      const threat = data.matches[0];
      safeBrowsingResultDiv.innerHTML = `
        <h3>Safety Scan Result: Warning</h3>
        <p><strong>Potential Risk Found:</strong> ${threat.threatType}</p>
        <p><strong>Educational Note:</strong> A flag from a safety scanner doesn't always mean a site is malicious. It could be flagged for various reasons. Always be cautious about downloading files or entering personal information. Verify the site's authenticity through other means.</p>
      `;
      safeBrowsingResultDiv.className = 'result-box warning';
    } else if (data.error) {
       safeBrowsingResultDiv.innerHTML = `
        <h3>Safety Scan Result</h3>
        <p>Could not complete the scan. The API service might be unavailable.</p>
        <p><strong>Details:</strong> ${data.details}</p>
      `;
      safeBrowsingResultDiv.className = 'result-box warning';
    }
    else {
      safeBrowsingResultDiv.innerHTML = `
        <h3>Safety Scan Result: No Immediate Risks Found</h3>
        <p><strong>Educational Note:</strong> This scan checks for known unsafe sites. It's a good first step, but remember that new threats appear daily. This result does not guarantee the site's content is trustworthy or accurate.</p>
      `;
      safeBrowsingResultDiv.className = 'result-box safe';
    }
  }

  analyzeButton.addEventListener('click', async () => {
    const inputText = textInput.value.trim();
    if (!inputText) {
      analysisResultDiv.innerHTML = `<p>Please enter some text or a URL to analyze.</p>`;
      analysisResultDiv.style.display = 'block';
      analysisResultDiv.className = 'result-box warning';
      return;
    }

    loader.style.display = 'block';
    analysisResultDiv.style.display = 'none';

    if (CLOUD_FUNCTION_URL === 'YOUR_FIREBASE_CLOUD_FUNCTION_URL') {
        console.log("Firebase Function URL not found. Returning mock data.");
        setTimeout(() => { 
            const mockResult = {
              "credibility_score": 65,
              "analysis_summary": "This is a mock analysis. The text shows signs of sensational language.",
              "educational_tips": [
                "Set up your Firebase function to see a real analysis.",
                "Compare claims with multiple trusted outlets.",
                "Look out for exaggerated headlines."
              ]
            };
            displayAnalysisResult(mockResult);
            loader.style.display = 'none';
            analysisResultDiv.style.display = 'block';
        }, 1000);
        return; 
    }

    try {
      const response = await fetch(CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();
      displayAnalysisResult(result);

    } catch (error) {
      console.error('Error fetching analysis:', error);
      analysisResultDiv.innerHTML = `<p>An error occurred. The analysis service might be unavailable. Please check your Firebase Function setup.</p>`;
      analysisResultDiv.className = 'result-box warning';
    } finally {
        loader.style.display = 'none';
        analysisResultDiv.style.display = 'block';
    }
  });

  function displayAnalysisResult(data) {
    let tipsHtml = data.educational_tips.map(tip => `<li>${tip}</li>`).join('');

    analysisResultDiv.innerHTML = `
      <h3>Credibility Analysis</h3>
      <p><strong>Score:</strong> ${data.credibility_score}/100</p>
      <p><em>(Note: This score is an educational estimate, not a final judgment.)</em></p>
      <p><strong>Summary:</strong> ${data.analysis_summary}</p>
      <h4>Learning Tips:</h4>
      <ul>${tipsHtml}</ul>
    `;
    analysisResultDiv.className = 'result-box';
  }

  analyzeCurrentPage();
});