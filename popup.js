document.getElementById("showAnswer").addEventListener("click", () => {
  const bookworkCode = document.getElementById("bookworkCode").value.trim();

  if (bookworkCode) {
    // Retrieve the screenshot from storage
    chrome.storage.local.get([bookworkCode], (data) => {
      const imageDataURL = data[bookworkCode];
      const answerDiv = document.getElementById("answer");

      if (imageDataURL) {
        answerDiv.innerHTML = `<img src="${imageDataURL}" style="max-width: 100%; height: auto;" alt="Answer" />`;
      } else {
        answerDiv.textContent = `No answer found for this code: ${bookworkCode}`;
      }
    });
  } else {
    alert("Please enter a Bookwork code.");
  }
});
