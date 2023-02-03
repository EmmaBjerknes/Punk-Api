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
function getBeerToFood() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(urlBase + "?food=" + inputQueryString.value);
        const data = yield response.json();
        return data;
    });
}
;
buttonSearch.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    wrapper.innerHTML = "";
    getBeerToFood().then((beer) => {
        const arrLength = beer.length;
        createCard(beer, arrLength);
    });
}));
function createCard(beer, o) {
    for (let i = 0; i < o; i++) {
        console.log(beer[i].name);
        const beerCard = document.createElement('div');
        beerCard.className = "beerCard";
        const cardHeader = document.createElement('h3');
        const cardTagline = document.createElement('p');
        const cardDesc = document.createElement('p');
        const cardFood = document.createElement('p');
        cardHeader.innerHTML = `${beer[i].name}`;
        cardTagline.innerHTML = `${beer[i].tagline}`;
        cardDesc.innerHTML = ` ${beer[i].description}`;
        for (let x = 0; x < 3; x++) {
            cardFood.innerHTML += `${beer[i].food_pairing[x]} </br>`;
        }
        beerCard.append(cardHeader, cardTagline, cardDesc, cardFood);
        wrapper.append(beerCard);
    }
}
