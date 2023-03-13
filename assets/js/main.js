"use strict"


// TODO:
// 1. Получить данные по АПИ
// 2. Вставить слово в контейнер (results-word)
// 3. Добавить функционал для воспроизведения звука
// 4. Вставить в контейнер с результатами

// VARIABLES
const URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const input = document.getElementById('word-input');
const form = document.querySelector('.form');
const resultsWrapper = document.querySelector('.results');
const containerWord = document.querySelector('.results-word');
const soundBox = document.querySelector('.results-sound');
const resultsList = document.querySelector('.results-list');
const errorContainer = document.querySelector('.error');

let state = {
  word: '',
  meanings: [],
  phonetics: [],
}


// FUNCTIONS
const showError = (error) => {
  errorContainer.style.display = 'block';
  resultsWrapper.style.display = 'none';
  errorContainer.innerText = error.message;
};

const renderDefinition = (itemDefinition) => {
  const example = itemDefinition.example
    ? `<div class="results-item__example"><p>Example: <span>${itemDefinition.example}</span></p></div>`
    : '';

  return `<div class="results-item__definition">
            <p>${itemDefinition.definition}</p>
            ${example}
          </div>`;
};

const getDefinitions = (definitions) => {

  return definitions.map(item => renderDefinition(item)).join('');

};

const renderItem = (item) => {

  return `<div class="results-item">
            <div class="results-item__part">${item.partOfSpeech}</div>
            <div class="results-item__definitions">
              ${getDefinitions(item.definitions)}
            </div>
          </div>`;
};

const showResults = () => {
  resultsList.innerHTML = '';

  state.meanings.forEach(item => resultsList.innerHTML += renderItem(item));
  resultsWrapper.style.display = 'block';
};

const insertWordToContainer = () => {
  containerWord.innerText = state.word;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  errorContainer.style.display = 'none';

  if (!state.word.trim()) return;

  try {
    const response = await fetch(`${URL}${state.word}`);
    const data = await response.json();
    console.log(data);

    if (response.ok && data.length) {
      const item = data[0];

      state = {
        ...state,
        meanings: item.meanings,
        phonetics: item.phonetics,
      }
      console.log(state);

      insertWordToContainer();
      showResults();
    } else {
      showError(data);
      console.log('my error')
    }
  } catch (err) {
    console.log(err);
  }
};

const handleKeyup = (e) => {
  const value = e.target.value;
  state.word = value;
};

const handleSound = () => {
  if (state.phonetics.length) {
    const sounds = state.phonetics[0];
    if (sounds.audio) {
      new Audio(sounds.audio).play();
      console.log('play');
    } else {
      console.log('not sound');
    }
  }
};



// EVENTS
input.addEventListener('keyup', handleKeyup);
form.addEventListener('submit', handleSubmit);
soundBox.addEventListener('click', handleSound);
console.log(state);
