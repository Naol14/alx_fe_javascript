const quotes = [
  { text: "Stay hungry, stay foolish.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Design" }
];

document.getElementById('newQuote').addEventListener('click', showRandomQuote)

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = `"${quote.text}" — ${quote.category}`;
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
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  document.getElementById("quoteDisplay").innerText = `"${text}" — ${category}`;

  
}
createAddQuoteForm();
