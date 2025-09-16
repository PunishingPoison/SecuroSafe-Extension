function getPageMetadata() {
  const title = document.title || '';
  const metaDescriptionTag = document.querySelector('meta[name="description"]');
  const description = metaDescriptionTag ? metaDescriptionTag.getAttribute('content') : '';
  const url = window.location.href;

  return { title, description, url };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageMetadata') {
    const metadata = getPageMetadata();
    sendResponse(metadata);
  }
});