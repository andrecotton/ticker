// Using a publicly available CORS proxy
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
const feeds = [
    "https://www.reddit.com/r/technology+worldnews+europe+foodforthought+foodnews+formula1+news+stocks.rss?limit=75", // Reddit technology for key 1
    "https://www.reddit.com/r/worldnews.rss?limit=75", // Placeholder URL for feed 2
    "https://example.com/rss/feed3", // Add your actual feed URLs for keys 2-9
    "https://example.com/rss/feed4",
    "https://example.com/rss/feed5",
    "https://example.com/rss/feed6",
    "https://example.com/rss/feed7",
    "https://example.com/rss/feed8",
    "https://example.com/rss/feed9"
];
var tickerElement = document.getElementById('ticker');

function fetchFeed(feedIndex) {
    const now = new Date().getTime(); // Cache buster
    const RSS_URL = feeds[feedIndex] + "&t=" + now; // Append cache buster
    fetch(`${CORS_PROXY}${RSS_URL}`)
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(data => {
        const entries = data.querySelectorAll("entry");
        let html = '';
        entries.forEach(entry => {
      // Extract the category term, make it uppercase and bold
      const categoryTerm = entry.querySelector("category").getAttribute("term").toUpperCase();
      const title = entry.querySelector("title").textContent;
      const contentHtml = entry.querySelector("content").textContent;
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(contentHtml, 'text/html');
      const links = htmlDoc.querySelectorAll("a");
      
      let directLink = '';
      let sourceName = 'Source';
      Array.from(links).forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.includes('reddit.com')) {
          directLink = href;
          const url = new URL(href);
          sourceName = url.hostname.replace('www.', ''); // Extract hostname without 'www'
          return;
        }
      });

      // Format: BOLD CATEGORY TERM | Title. (Source)
      html += `<div class="ticker__item"><div class="ticker__item-content"><strong>${categoryTerm}:&nbsp;</strong><br>${title}.</div><br> <a href="${directLink}" target="_blank">(${sourceName})</a></div>`;
    });
    tickerElement.innerHTML = html; // Insert the formatted HTML into the ticker element
        animateTicker();

  })
  .catch(error => console.error('Error fetching or processing the RSS feed:', error));
}

function animateTicker() {
    const items = document.querySelectorAll('.ticker__item');
    let currentIndex = 0;
    let currentTranslateY = 0;

    const moveUp = () => {
        if (currentIndex < items.length) {
            currentTranslateY = -(currentIndex * items[0].clientHeight);
            tickerElement.style.transform = `translateY(${currentTranslateY}px)`;
            tickerElement.style.transition = `transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)`;
            currentIndex++;
        } else {
            // Reset without seeing the transition
            tickerElement.style.transition = 'none'; // Disable transition for the reset
            tickerElement.style.transform = `translateY(0)`; // Move back to start without animation
            tickerElement.offsetHeight; // Trigger reflow
            currentIndex = 1; // Set to start from the second item next interval
        }
    };

    // Start the animation with an interval
    setInterval(moveUp, 6000); // Adjust time as necessary
}



fetchFeed(0);

//script to add keyboard adjustments
document.addEventListener('keydown', function(event) {
  const ticker = document.querySelector('.ticker');
  const tickerItems = document.querySelectorAll('.ticker__item');
  let currentDuration = parseFloat(window.getComputedStyle(ticker, null).animationDuration.replace("s", ""));
  let currentFontSize = parseFloat(window.getComputedStyle(tickerItems[0], null).fontSize.replace("px", ""));
  
  switch(event.key.toLowerCase()) {
    case 'a': // Slows down the animation
      ticker.style.animationDuration = `${currentDuration + 50}s`;
      break;
    case 'd': // Speeds up the animation
      ticker.style.animationDuration = `${Math.max(10, currentDuration - 50)}s`; // Prevent negative duration
      break;
    case 's': // Decrease font size
      tickerItems.forEach(item => {
        item.style.fontSize = `${Math.max(0.2, currentFontSize - 2)}px`; // Prevent too small font size
      });
      break;
    case 'w': // Increase font size
      tickerItems.forEach(item => {
        item.style.fontSize = `${currentFontSize + 2}px`;
      });
      break;
    case 'e': // Toggle dark mode
      document.body.classList.toggle('dark-mode');
      break;
  }

    if (event.key >= '1' && event.key <= '9') {
        const feedIndex = parseInt(event.key, 10) - 1; // Convert key to feed index
        if (feeds[feedIndex]) { // Check if the feed exists
            fetchFeed(feedIndex); // Fetch the selected feed
        }
    }
});

document.addEventListener('keydown', function(event) {
    // Check if the '/' key is pressed
    if (event.key === 'q') {
        event.preventDefault(); // Prevent the default action of the '/' key
        const subreddit = prompt("Enter the name:");
        if (subreddit) { // If input is not null or empty
            const newRssUrl = "https://www.reddit.com/r/${subreddit}.rss?limit=75";
            // Update the RSS_URL variable and call the function to fetch and display the feed
            fetchCustomFeed(newRssUrl);
        }
    }
});

function fetchCustomFeed(newRssUrl) {
    const now = new Date().getTime(); // Cache buster
    const RSS_URL = newRssUrl + "&t=" + now; // Append cache buster
    fetch(`${CORS_PROXY}${RSS_URL}`)
      .then(response => response.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(data => {
        const entries = data.querySelectorAll("entry");
        let html = '';
        entries.forEach(entry => {
      // Extract the category term, make it uppercase and bold
      const categoryTerm = entry.querySelector("category").getAttribute("term").toUpperCase();
      const title = entry.querySelector("title").textContent;
      const contentHtml = entry.querySelector("content").textContent;
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(contentHtml, 'text/html');
      const links = htmlDoc.querySelectorAll("a");
      
      let directLink = '';
      let sourceName = 'Source';
      Array.from(links).forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.includes('reddit.com')) {
          directLink = href;
          const url = new URL(href);
          sourceName = url.hostname.replace('www.', ''); // Extract hostname without 'www'
          return;
        }
      });

      // Format: BOLD CATEGORY TERM | Title. (Source)
      html += `<div class="ticker__item"><div class="ticker__item-content"><strong>${categoryTerm}:&nbsp;</strong><br>${title}.</div><br> <a href="${directLink}" target="_blank">(${sourceName})</a></div>`;
    });
    tickerElement.innerHTML = html; // Insert the formatted HTML into the ticker element
        animateTicker();
  })
  .catch(error => console.error('Error fetching or processing the RSS feed:', error));
}

let menuOpen = false;

function toggleSettingsMenu() {
    const settingsMenu = document.getElementById('settings-menu');
    const settingsButton = document.getElementById('settings-button');
    if (!menuOpen) {
        settingsMenu.style.right = '0';
        settingsButton.innerHTML = '&times;'; // Change to 'X' icon
	settingsButton.style.color = "white"; // Change to 'X' icon
    } else {
        settingsMenu.style.right = '-250px';
        settingsButton.innerHTML = '&#9776;'; // Change back to three lines
	settingsButton.style.color = "#202020"; // Change to 'X' icon
    }
    menuOpen = !menuOpen;
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function increaseFontSize() {
    const tickerItems = document.querySelectorAll('.ticker__item');
    tickerItems.forEach(item => {
        let currentFontSize = parseFloat(window.getComputedStyle(item, null).fontSize.replace("px", ""));
        item.style.fontSize = `${currentFontSize + 2}px`;
    });
}

function decreaseFontSize() {
    const tickerItems = document.querySelectorAll('.ticker__item');
    tickerItems.forEach(item => {
        let currentFontSize = parseFloat(window.getComputedStyle(item, null).fontSize.replace("px", ""));
        item.style.fontSize = `${Math.max(0.2, currentFontSize - 2)}px`;
    });
}

function increaseSpeed() {
    const ticker = document.querySelector('.ticker');
    let currentDuration = parseFloat(window.getComputedStyle(ticker, null).animationDuration.replace("s", ""));
    ticker.style.animationDuration = `${Math.max(10, currentDuration - 5)}s`;
}

function decreaseSpeed() {
    const ticker = document.querySelector('.ticker');
    let currentDuration = parseFloat(window.getComputedStyle(ticker, null).animationDuration.replace("s", ""));
    ticker.style.animationDuration = `${currentDuration + 5}s`;
}

