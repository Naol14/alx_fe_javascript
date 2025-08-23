let quotes = [];

    function getDefaultQuotes() {
      return [
        { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" }
      ];
    }

    function loadQuotes() {
      const storedQuotes = localStorage.getItem("quotes");
      if (storedQuotes) {
        try {
          const parsed = JSON.parse(storedQuotes);
          if (Array.isArray(parsed)) {
            quotes = parsed;
          } else {
            throw new Error("Stored quotes are not an array.");
          }
        } catch (e) {
          console.warn("Error parsing stored quotes:", e);
          quotes = getDefaultQuotes();
          localStorage.setItem("quotes", JSON.stringify(quotes));
        }
      } else {
        quotes = getDefaultQuotes();
        localStorage.setItem("quotes", JSON.stringify(quotes));
      }
    }

    function showRandomQuote() {
      if (!Array.isArray(quotes) || quotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "No quotes available.";
        return;
      }

      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];

      if (!quote || typeof quote.text !== "string" || typeof quote.category !== "string") {
        document.getElementById("quoteDisplay").textContent = "Quote format is invalid.";
        console.log("Invalid quote object:", quote);
        return;
      }

      document.getElementById("quoteDisplay").textContent = `"${quote.text}" — ${quote.category}`;
      sessionStorage.setItem("lastQuote", JSON.stringify(quote));
    }

    function createAddQuoteForm() {
const formDiv = document.createElement('div');
formDiv.className = 'quote-form';


const inputText = document.createElement('input');
inputText.type = 'text';
inputText.placeholder = 'Enter a new quote';
inputText.id = 'newQuoteText';

const inputCategory = document.createElement('input');
inputCategory.type = 'text';
inputCategory.placeholder = 'Enter quote category';
inputCategory.id = 'newQuoteCategory';

const addButton = document.createElement('button');
addButton.innerText = 'Add Quote';
addButton.onclick = addQuote;

formDiv.appendChild(inputText);
formDiv.appendChild(inputCategory);
formDiv.appendChild(addButton);
document.body.appendChild(formDiv);
}

    function addQuote() {
      const text = document.getElementById("quoteInput").value.trim();
      const category = document.getElementById("categoryInput").value.trim();

      if (!text || !category) {
        alert("Please enter both quote and category.");
        return;
      }

      const newQuote = { text, category };
      quotes.push(newQuote);
      localStorage.setItem("quotes", JSON.stringify(quotes));
      document.getElementById("quoteInput").value = "";
      document.getElementById("categoryInput").value = "";
      document.getElementById("quoteDisplay").textContent = `"${text}" — ${category}`;
    }

    function exportQuotes() {
      const dataStr = JSON.stringify(quotes, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quotes.json";
      a.click();
      URL.revokeObjectURL(url);
    }

    function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      let importedQuotes = JSON.parse(e.target.result);

      // ✅ Convert old format if needed
      if (!Array.isArray(importedQuotes)) {
        if (importedQuotes.quote && importedQuotes.author) {
          importedQuotes = [{ text: importedQuotes.quote, category: importedQuotes.author }];
        } else {
          alert("Invalid file format.");
          return;
        }
      }

      const validQuotes = importedQuotes.filter(q =>
        q && typeof q.text === "string" && typeof q.category === "string"
      );

      quotes = quotes.concat(validQuotes);
      localStorage.setItem("quotes", JSON.stringify(quotes));
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Error reading file.");
      console.error(err);
    }
  };
  reader.readAsText(file);
}

/*task2*/
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
  showRandomQuote(filtered);
}

function restoreFilter() {
  const savedCategory = localStorage.getItem("lastSelectedCategory");
  if (savedCategory) {
    document.getElementById("categoryFilter").value = savedCategory;
    filterQuotes();
  }
}



    window.onload = loadQuotes;
    

  document.addEventListener("DOMContentLoaded", function () {
      loadQuotes();
      showRandomQuote();
      populateCategories();

      const newQuoteButton = document.getElementById("newQuote");
      if (newQuoteButton) {
        newQuoteButton.addEventListener("click", showRandomQuote);
      }
      const filterBtn = document.getElementById("filterBtn");
  if (filterBtn) {
    filterBtn.addEventListener("click", filterQuotes);
  }

  restoreFilter();
    });
    
    
    fetch('index.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('container').innerHTML = data;
    });

    /*task3*/
    async function fetchQuotesFromServer() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();

  // Adapt the data to your quote format
  const serverQuotes = data.map(post => ({
    id: post.id,
    text: post.title,
    category: 'Server' // placeholder category
  }));

  resolveConflicts(serverQuotes);}

  const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

async function syncWithServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    const serverQuotes = serverData.map(post => ({
      id: post.id,
      text: post.title,
      category: 'Server'
    }));

    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

    const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);
    localStorage.setItem('quotes', JSON.stringify(mergedQuotes));

    console.log('Quotes synced with server!');
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

function mergeQuotes(local, server) {
  const existingIds = new Set(local.map(q => q.id));
  const newQuotes = server.filter(q => !existingIds.has(q.id));
  return [...local, ...newQuotes];
}

// Start periodic sync
setInterval(syncWithServer, 30000);

function resolveConflicts(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  const merged = serverQuotes.map(serverQuote => {
    const localMatch = localQuotes.find(q => q.id === serverQuote.id);
    return localMatch ? serverQuote : serverQuote;
  });

  // Add any local quotes that aren't on the server
  const localOnly = localQuotes.filter(q => !serverQuotes.some(sq => sq.id === q.id));
  const finalQuotes = [...merged, ...localOnly];

  localStorage.setItem('quotes', JSON.stringify(finalQuotes));
}

async function addQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST', // ✅ Required for sending data
      headers: {
        'Content-Type': 'application/json' // ✅ Tells server you're sending JSON
      },
      body: JSON.stringify(quote) // ✅ Converts quote object to JSON string
    });

    const result = await response.json();
    console.log('Quote posted to server:', result);
  } catch (error) {
    console.error('Error posting quote:', error);
  }
}


    