document.addEventListener('DOMContentLoaded', () => {
    const autoCheckCheckbox = document.getElementById('auto-check');
    const saveButton = document.getElementById('save-button');
    const statusDiv = document.getElementById('status');

    function restoreOptions() {
        chrome.storage.sync.get({
            autoCheckEnabled: true
        }, (items) => {
            autoCheckCheckbox.checked = items.autoCheckEnabled;
        });
    }

    function saveOptions() {
        const autoCheckEnabled = autoCheckCheckbox.checked;
        chrome.storage.sync.set({
            autoCheckEnabled: autoCheckEnabled
        }, () => {
            statusDiv.textContent = 'Options saved.';
            setTimeout(() => {
                statusDiv.textContent = '';
            }, 1500);
        });
    }

    restoreOptions();
    saveButton.addEventListener('click', saveOptions);
});