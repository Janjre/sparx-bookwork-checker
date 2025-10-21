// // Function to check for the "Bookwork code" element
// function findBookworkCode() {
//   // Target more specific divs if possible, replace this with a better selector if available
//   const divs = document.querySelectorAll("div");
//   console.log("asked to find bookwork check")
//   divs.forEach((div) => {
//     const text = div.textContent.trim();

//     // Use regex to find and extract the "Bookwork code" if pres ent
//     const regex = /Bookwork code:\s*(\w+)/;
//     const match = text.match(regex);
//     if (match) {
//       const bookworkCode = match[1];  // Extracted code after "Bookwork code:"
//       console.log("Found and extracted Bookwork code:", bookworkCode);
      
//       // Stop observing after finding the code
//       observer.disconnect();
//       if (bookworkCode.length != 2) {
//         certainBWCode = bookworkCode;
//         return certainBWCode
//       }
//     }
//   });
// }



// // Function to check for the appearance of a "Well Done" message
// function checkCompletion() {
//   // Check if the "Correct!" message is displayed
//   const resultMessage = document.querySelector('span._ResultMessage_1ylu5_132');
  
//   // Check if the message contains "Correct!" text
//   if (resultMessage && resultMessage.textContent.includes('Correct!')) {
//     console.log("Question completed and 'Well Done' popup displayed!");
//     bwCode = findBookworkCode();
//     if (bwCode) {
//       console.log(bwCode);
//     }
//     else {
//       console.log("No code found")
//     }
//     // You can add your custom code here to handle the event
//   }
// }

// // Set interval to check every 0.5 seconds (500ms)
// setInterval(checkCompletion, 500);


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
        resolve(bookworkCode);
      }
    });

    // If no code is found after the loop, reject the Promise
    reject("No bookwork code found");
  });
}

function findAnswer(name) {
  console.log("askedForScreenshot")
  const element = document.querySelector('#root > div:nth-child(3) > div:nth-child(2) > div > div > div > div > div:nth-child(1) > div:nth-child(2)');

  if (element) {
    html2canvas(element).then(canvas => {
      const imageDataURL = canvas.toDataURL("image/png");

      // Save the image data URL in Chrome's local storage
      chrome.storage.local.set({ name: imageDataURL }, () => {
        console.log("Screenshot saved.");
      });
    });
  } else {
    console.log("Element not found");
  }  
}

function getAnswer (code) {
  chrome.storage.local.get(code, (data) => {
    console.log("asked for screenshot")
    if (data.screenshot) {
      console.log("Screenshot URL:", data.screenshot);
      // You could set it as an image source in your extension, for example:
      // const img = document.createElement('img');
      // img.src = data.screenshot;
      // document.body.appendChild(img);
    } else {
      console.log("No screenshot found in storage.");
    }
  });
}




// Function to check for the appearance of a "Well Done" message
async function checkCompletion() {
  // Check if the "Correct!" message is displayed
  const resultMessage = document.querySelector('span._ResultMessage_1ylu5_132');
  
  // Check if the message contains "Correct!" text
  if (resultMessage && resultMessage.textContent.includes('Correct!')) {
    if (lastCorrect == 0){
      console.log("Question completed and 'Well Done' popup displayed!");
      lastCorrect = true  
      try {
        // Wait for the bookwork code to be found asynchronously
        const bwCode = await findBookworkCode();
        console.log("Bookwork Code Found:", bwCode);
        findAnswer(bwCode);
      } catch (error) {
        console.log(error);  // Handle case where no bookwork code was found
      }
      
    }
  }else{
    lastCorrect = false
  }
}

// Set interval to check every 0.5 seconds (500ms)
setInterval(checkCompletion, 500);
