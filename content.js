// Function to check for the "Bookwork code" element
function findBookworkCode() {
  return new Promise((resolve, reject) => {
    // Target more specific divs if possible, replace this with a better selector if available
    const divs = document.querySelectorAll("div");
    console.log("Asked to find bookwork check");
    
    divs.forEach((div) => {
      const text = div.textContent.trim();
      const regex = /Bookwork code:\s*(\w+)/;
      const match = text.match(regex);
      if (match) {
        const bookworkCode = match[1];  // Extracted code after "Bookwork code:"
        console.log("Found and extracted Bookwork code:", bookworkCode);
        
        // Resolve the Promise with the bookwork code
        if (bookworkCode.length === 2){
          resolve(bookworkCode);
        } else {
          console.log("bookwork code not right")
        }
        
      }
    });

    // If no code is found after the loop, reject the Promise
    reject("No bookwork code found");
  });
}


// Function to take and instantly display a screenshot
function takeScreenshot(name) {
  console.log("Asked for screenshot");

  const element = document.querySelector(
    "#root > div:nth-child(3) > div:nth-child(2) > div > div > div > div > div:nth-child(1) > div:nth-child(2)"
  );

  if (element) {
    setTimeout(() => { // Wait for animations to finish
      html2canvas(element, { useCORS: true }).then((canvas) => {
        const imageDataURL = canvas.toDataURL("image/png");

        // Save the screenshot with the bookwork code as the key
        const data = {};
        data[name] = imageDataURL;
        chrome.storage.local.set(data, () => {
          if (chrome.runtime.lastError) {
            console.error("Error saving screenshot:", chrome.runtime.lastError);
          } else {
            console.log("Screenshot saved successfully.");
          }
        });
      });
    }, 2); // 1-second delay
    console.log("TAKEN SCREENSHOT under name ", name)
  } else {
    console.log("Element not found");
  }
}


// Function to get the saved answer screenshot
function getAnswer(code) {
  chrome.storage.local.get(code, (data) => {
    console.log("Asked for screenshot");
    if (data[code]) {
      console.log("Screenshot URL:", data[code]);
      // Example usage: Create an image element to display the screenshot
      const img = document.createElement('img');
      img.src = data[code];
      document.body.appendChild(img);
    } else {
      console.log("No screenshot found in storage.");
    }
  });
}

// Function to check for the appearance of a "Well Done" message
let lastCorrect = false; // Track the last state of completion

async function checkCompletion() {
  console.log("ran")
  const resultMessage = document.querySelector('span._ResultMessage_1ylu5_132');

  if (resultMessage && resultMessage.textContent.includes('Correct!')) {
    console.log("sucess") 
    if (!lastCorrect) { // Only trigger if it wasn't detected before
      lastCorrect = true;
      console.log("Question completed and 'Well Done' popup displayed!");

      // Add a delay before finding the Bookwork code and taking the screenshot
      setTimeout(async () => {
        try {
          const bwCode = await findBookworkCode(); // Wait for Bookwork code
          console.log("Bookwork Code Found:", bwCode);
          takeScreenshot(bwCode); // Take and display the screenshot
        } catch (error) {
          console.log(error); // Handle case where no Bookwork code was found
        }
      }, 1); // 1ms delay
    }
  } else {
    lastCorrect = false; // Reset if the "Correct!" message is gone
  }
}

// Set interval to check every 0.5 seconds (500ms)
setInterval(checkCompletion, 500);
