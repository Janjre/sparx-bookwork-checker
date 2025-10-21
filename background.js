// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "capture_element") {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
            const img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = message.rect.width;
                canvas.height = message.rect.height;
                const context = canvas.getContext("2d");
                context.drawImage(
                    img,
                    message.rect.x, message.rect.y, message.rect.width, message.rect.height,
                    0, 0, message.rect.width, message.rect.height
                );

                // Convert canvas to a Data URL
                const croppedDataUrl = canvas.toDataURL("image/png");

                // Now, you could save the croppedDataUrl or open it in a new tab
                chrome.storage.local.set({ screenshot: croppedDataUrl }, () => {
                    console.log("Screenshot saved!");
                });
            };
        });
    }
});
