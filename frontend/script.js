const categoryButtons = document.getElementById("category-buttons");
const jokeDisplay = document.getElementById("joke-display");
const jokeText = document.getElementById("joke");
const responseText = document.getElementById("response");
const allJokesList = document.getElementById("jokes-list");
const addJokeForm = document.getElementById("add-joke-form");
const categorySelect = document.getElementById("category-select");
const showStatsBtn = document.getElementById("show-stats-btn");
const statsTable = document.getElementById("stats-table");
const statsBody = document.getElementById("stats-body");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResultsContainer = document.getElementById("search-results");

const API_URL = "http://localhost:3000/jokebook";

async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        displayCategories(categories);
        populateCategorySelect(categories);
    } catch (error) {
        console.error("Błąd podczas pobierania kategorii:", error);
    }
}

function displayCategories(categories) {
    categoryButtons.innerHTML = "";
    categories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category;
        button.addEventListener("click", () => {
            fetchRandomJoke(category);
            fetchAllJokes(category);
        });
        categoryButtons.appendChild(button);
    });
}

function populateCategorySelect(categories) {
    categorySelect.innerHTML = "";
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

async function fetchRandomJoke(category) {
    try {
        const response = await fetch(`${API_URL}/joke/${category}`);
        const joke = await response.json();
        displayJoke(joke);
    } catch (error) {
        console.error(`Błąd podczas pobierania żartu z kategorii ${category}:`, error);
        jokeText.textContent = "Nie udało się załadować żartu.";
        responseText.textContent = "";
    }
}

async function fetchAllJokes(category) {
    try {
        const response = await fetch(`${API_URL}/all/${category}`);
        const jokes = await response.json();
        displayAllJokes(jokes);
    } catch (error) {
        console.error(`Błąd podczas pobierania wszystkich żartów z kategorii ${category}:`, error);
        allJokesList.innerHTML = "<li>Nie udało się załadować listy żartów.</li>";
    }
}

function displayJoke(joke) {
    jokeText.textContent = joke.joke;
    responseText.textContent = joke.response;
}

function displayAllJokes(jokes) {
    allJokesList.innerHTML = "";
    jokes.forEach((joke) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${joke.joke} - ${joke.response}`;
        allJokesList.appendChild(listItem);
    });
}

addJokeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(addJokeForm);
    const category = formData.get("category");
    const joke = formData.get("joke");
    const response = formData.get("response");

    try {
        const res = await fetch(`${API_URL}/joke/${category}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ joke, response }),
        });

        if (res.ok) {
            addJokeForm.reset();
            const selectedCategory = categoryButtons.querySelector("button.active")?.textContent;
            if (selectedCategory) {
                fetchAllJokes(selectedCategory);
            }
        } else {
            console.error("Błąd podczas dodawania żartu:", await res.json());
        }
    } catch (error) {
        console.error("Błąd podczas dodawania żartu:", error);
    }
});

async function fetchStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();
        displayStats(stats);
    } catch (error) {
        console.error("Błąd podczas pobierania statystyk:", error);
    }
}

function displayStats(stats) {
    statsBody.innerHTML = "";
    for (const category in stats) {
        const row = document.createElement("tr");
        const categoryCell = document.createElement("td");
        const countCell = document.createElement("td");

        categoryCell.textContent = category;
        countCell.textContent = stats[category];

        row.appendChild(categoryCell);
        row.appendChild(countCell);
        statsBody.appendChild(row);
    }
    statsTable.classList.remove("hidden");
}

showStatsBtn.addEventListener("click", fetchStats);

async function searchJokes(word) {
    try {
        const response = await fetch(`${API_URL}/search?word=${encodeURIComponent(word)}`);
        const results = await response.json();
        displaySearchResults(results);
    } catch (error) {
        console.error("Błąd podczas wyszukiwania żartów:", error);
        searchResultsContainer.innerHTML = "<p>Wystąpił błąd podczas wyszukiwania.</p>";
    }
}

function displaySearchResults(results) {
    searchResultsContainer.innerHTML = "";

    if (results.length === 0) {
        searchResultsContainer.innerHTML = "<p>Brak żartów pasujących do wyszukiwania.</p>";
        return;
    }

    const list = document.createElement("ul");
    list.style.listStyleType = "none";
    list.style.paddingLeft = "0";

    results.forEach((joke) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `[${joke.category}] ${joke.joke} — <i>${joke.response}</i>`;
        listItem.style.marginBottom = "10px";
        list.appendChild(listItem);
    });

    searchResultsContainer.appendChild(list);
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        searchJokes(searchTerm);
    }
});

// Inicjalizacja
fetchCategories();
