"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const urlBase = "https://api.punkapi.com/v2/beers";
const inputQueryString = document.querySelector("#query-string");
const buttonSearch = document.querySelector("#search-button");
const wrapper = document.querySelector("#content-box");
buttonSearch.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    wrapper.innerHTML = "";
    const response = yield fetch(urlBase + "?food=" + inputQueryString.value);
    const data = yield response.json();
    console.log(data);
    const arrLength = data.length;
    for (let i = 0; i < arrLength; i++) {
        console.log(data[i].name);
        const movieCard = document.createElement('div');
        movieCard.className = "movieCard";
        const movieHeader = document.createElement('h3');
        const director = document.createElement('p');
        const releaseDate = document.createElement('p');
        const openingCrawl = document.createElement('p');
        movieHeader.innerHTML = `${data[i].name}`;
        director.innerHTML = `${data[i].tagline}`;
        releaseDate.innerHTML = ` ${data[i].description}`;
        for (let x = 0; x < 3; x++) {
            openingCrawl.innerHTML += `${data[i].food_pairing[x]} </br>`;
        }
        movieCard.append(movieHeader, director, releaseDate, openingCrawl);
        wrapper.append(movieCard);
    }
}));
