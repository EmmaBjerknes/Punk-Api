const urlBase = "https://api.punkapi.com/v2/beers";
//?page=1&per_page=80
//

const inputQueryString = document.querySelector("#query-string") as HTMLInputElement;
const buttonSearch = document.querySelector("#search-button") as HTMLButtonElement;

const wrapper = document.querySelector("#content-box") as HTMLElement;

buttonSearch.addEventListener("click",async (event) => {
    event.preventDefault();
    wrapper.innerHTML= "";
    const response = await fetch(urlBase + "?food=" + inputQueryString.value);
    const data = await response.json();
    console.log(data);

    const arrLength : number = data.length;

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
        for(let x = 0; x < 3; x++){
            openingCrawl.innerHTML += `${data[i].food_pairing[x]} </br>`;
        }

        movieCard.append(movieHeader, director, releaseDate, openingCrawl);      
        wrapper.append(movieCard);

    }
})


/*
async function getBeerToFood() {
    const response = await fetch(urlBase + "/random");
    const data: object[] = await response.json();

    console.log(data[0]);
}

getBeerToFood();*/