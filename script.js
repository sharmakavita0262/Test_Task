// Replace 'your_api_endpoint' with the actual API endpoint URL
const apiEndpoint = 'https://pokeapi.co/api/v2/pokemon/?offset=151&limit=151';
const pokemonImage = document.getElementById('pokemonImage');
const pointsDisplay = document.getElementById('points');
const optionsContainer = document.getElementById('optionsContainer');
const resultMessage = document.getElementById('resultMessage');
let points = 0;

// Use the fetch function to make a GET request
function fetchAndShufflePokemonImages() {
  fetch(apiEndpoint)
    .then(response => {
      // Check if the request was successful (status code 200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the response JSON
      return response.json();
    })
    .then(data => {
      // Handle the data retrieved from the API
      const pokemonList = data.results.map(pokemon => ({
        name: pokemon.name,
        url: pokemon.url,
      }));

      // Shuffle the array using Fisher-Yates shuffle algorithm
      for (let i = pokemonList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pokemonList[i], pokemonList[j]] = [pokemonList[j], pokemonList[i]];
      }

      displayPokemonImage(pokemonList[0].url);
      displayOptions(pokemonList);
    })
    .catch(error => {
      // Handle errors that may occur during the fetch
      console.error('Fetch error:', error);
    });
}

function displayPokemonImage(url) {
  fetch(url)
    .then(response => response.json())
    .then(pokemonData => {
      pokemonImage.src = pokemonData.sprites.front_default;
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

function displayOptions(pokemonList) {
  // Shuffle the array again to get random options
  for (let i = pokemonList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pokemonList[i], pokemonList[j]] = [pokemonList[j], pokemonList[i]];
  }

  // Display four options
  for (let i = 0; i < 4; i++) {
    const optionButton = document.createElement('button');
    optionButton.classList.add('optionButton');
    optionButton.textContent = pokemonList[i].name;
    optionButton.addEventListener('click', () => checkAnswer(optionButton, pokemonList[i].url, pokemonList[0].url));
    optionsContainer.appendChild(optionButton);
  }
}

function checkAnswer(button, selectedUrl, correctUrl) {
  optionsContainer.querySelectorAll('.optionButton').forEach(optionButton => {
    optionButton.disabled = true; // Disable all buttons to prevent further clicks during the delay
  });

  if (selectedUrl === correctUrl) {
    showResultMessage('Correct Answer!', 'green');
    points += 1;
    button.style.backgroundColor = 'green'; // Change the color to green for the correct answer
  } else {
    showResultMessage('Wrong Answer!', 'red');
    button.style.backgroundColor = 'red'; // Change the color to red for the incorrect answer
    points = 0;
  }

  updatePointsDisplay();

  setTimeout(() => {
    optionsContainer.querySelectorAll('.optionButton').forEach(optionButton => {
      optionButton.disabled = false; // Enable all buttons after the delay
      optionButton.style.backgroundColor = ''; // Reset the background color
    });
    resultMessage.textContent = '';
    resultMessage.style.color = '';
    clearOptions();
    fetchAndShufflePokemonImages();
  }, 2000); // 2 seconds delay
}

function updatePointsDisplay() {
  pointsDisplay.textContent = `${points}`;
}

function showResultMessage(message, color) {
  resultMessage.textContent = message;
  resultMessage.style.color = color;
}

function clearOptions() {
  optionsContainer.innerHTML = '';
}

// Start the quiz
fetchAndShufflePokemonImages();
