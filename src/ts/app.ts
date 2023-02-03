const urlBase = "https://api.punkapi.com/v2/beers";
//?page=1&per_page=80
//

const inputQueryString = document.querySelector("#query-string") as HTMLInputElement;
const buttonSearch = document.querySelector("#search-button") as HTMLButtonElement;
const wrapper = document.querySelector("#content-box") as HTMLElement;
const selectCategories = document.querySelector("#categories") as HTMLSelectElement;


async function getBeerToFood(){
    const response = await fetch(urlBase + "?food=" + inputQueryString.value);
    const data: object[] = await response.json();
    return data;
};

buttonSearch.addEventListener("click",async (event) => {
    event.preventDefault();
    wrapper.innerHTML= "";
    getBeerToFood().then((beer)=>{
        const arrLength : number = beer.length;
        createCard(beer, arrLength);
    });
})

function createCard(beer: any, o:number){ //beer: any <- must change that
    wrapper.innerHTML= "";
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
        // change to check length of food_pairing array
        for(let x = 0; x < 3; x++){
            cardFood.innerHTML += `${beer[i].food_pairing[x]} </br>`;
        }

        beerCard.append(cardHeader, cardTagline, cardDesc, cardFood);      
        wrapper.append(beerCard);
    }
}


// Make a dropdown with the name of the beer
async function getNameOfBeer() {
    const response = await fetch(urlBase + "?page=1&per_page=80");
    const data: object[] = await response.json();

    data.forEach((element:any) => { // another any, 
        //console.log(element.name);
        let optionCategory = document.createElement("option");
        optionCategory.innerHTML = element.name;
        selectCategories.append(optionCategory);
    });
}


async function x(){
    const response = await fetch(urlBase + "?beer_name=" + selectCategories.value);
    const data: object[] = await response.json();
    return data;
};


selectCategories.addEventListener("change", async(event)=>{
    event.preventDefault();
    x().then((beer)=>{
        const arrLength : number = beer.length;
        createCard(beer, arrLength);
    });
});



getNameOfBeer();