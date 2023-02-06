const urlBase = "https://api.punkapi.com/v2/beers";

import RootObject from './beer';

const inputQueryString = document.querySelector("#query-string") as HTMLInputElement;
const buttonSearch = document.querySelector("#search-button") as HTMLButtonElement;
const buttonRandFood = document.querySelector("#random-food-button") as HTMLButtonElement;
const wrapper = document.querySelector("#content-box") as HTMLElement;
const selectBeer = document.querySelector("#beerName") as HTMLSelectElement;
const randomFoodBox = document.querySelector("#random-food") as HTMLTableSectionElement;



/*============ Fetch URL ================= */
async function getBeerData(param:string, value:string){
    const response = await fetch(urlBase + param + value);
    const data = await response.json();
    if (data.length <= 0){
        alert("No food matches your search. Try: tips");

    }
    return data;
};

/* === Takes an food input/ food search and makes it so i can use it for a fetch ===*/
function remakeString(str:string):string{
    const sliced = str.replace(" ", "_");
    return sliced
};
/* == Takes the user input when searching for food / click the random food option */
async function foodSearch(foodName:string){

    let foodString = remakeString(foodName);

    getBeerData("?food=", foodString).then((beer: RootObject[])=>{
        const arrLength : number = beer.length;
        createCard(beer, arrLength);
    });
}

/* === Create Cards that holds beer info === */
function createCard(beer: RootObject[], o:number){ 
    wrapper.innerHTML= "";
    for (let i = 0; i < o; i++) {
        const beerCard = document.createElement("div");
        beerCard.className = "beerCard";
        const cardHeader = document.createElement("h3");
        const cardTagline = document.createElement("p");
        const cardDesc = document.createElement("p");
        const cardFood = document.createElement("p");
        const cardImg = document.createElement("img");
        if(beer[i].image_url === null){
            cardImg.alt = "Oh, there is no img to this beer"
        }else{
            cardImg.src = `${beer[i].image_url}`;
        }

        cardHeader.innerHTML = `${beer[i].name}`;
        cardTagline.innerHTML = `${beer[i].tagline}`;
        cardDesc.innerHTML = ` ${beer[i].description}`;
        // change to check length of food_pairing array
        for(let x = 0; x < 3; x++){
            // check if its undefined
            if(beer[i].food_pairing[x] === undefined){
                console.log("Herp");
                cardFood.innerHTML += "";
            }else{
                cardFood.innerHTML += `${beer[i].food_pairing[x]} </br>`;                
            }
        }

        beerCard.append(cardHeader, cardTagline, cardDesc, cardFood,cardImg);      
        wrapper.append(beerCard);
    }
}

/* === Make a dropdown with the name of the beer ===*/
// option - sida 1-> sida 2 osv?
async function getNameOfBeer(x: string) {
    const response = await fetch(urlBase + x);
    const data = await response.json();

    data.forEach((element:any) => { // another any, 
        //console.log(element.name);
        let optionCategory = document.createElement("option");
        optionCategory.innerHTML = element.name;
        selectBeer.append(optionCategory);
    });
}

/* === EventListeners === */
// free text search for food
buttonSearch.addEventListener("click",async (event) => {
    event.preventDefault();
    wrapper.innerHTML= "";
    if(inputQueryString.value.length > 0){
        foodSearch(inputQueryString.value);
    }else{
        alert("Need a input");
    };

});
// Dropdown that shows the name of the beers
selectBeer.addEventListener("change", async(event)=>{
    event.preventDefault();
    getBeerData("?beer_name=", selectBeer.value).then((beer: RootObject[])=>{
        const arrLength : number = beer.length;
        createCard(beer, arrLength);
    });
});
// Dropdown that toggle between the API-pages of all beers
const selectedPageList = document.querySelector("#pageList") as HTMLSelectElement;
selectedPageList.addEventListener("change", async(event)=>{
    event.preventDefault();
    selectBeer.innerHTML = "";
    getNameOfBeer(selectedPageList.value);
});



const randFood = document.createElement("p");
// Gives a random food option 
buttonRandFood.addEventListener("click", async (event)=>{
    event.preventDefault();

    let foodSugg: string;

    getBeerData("/", "random").then((beer: RootObject[])=>{
        beer.forEach((element:any) => { // another any,
            //console.log(element);           
            const foodArrLength: number = element.food_pairing.length;
            const random = Math.floor(Math.random() * foodArrLength);
            foodSugg = element.food_pairing[random];
        });
        buttonRandFood.innerText = "Give me another one";

        const yesBtn = document.createElement("button");
        yesBtn.innerText = "Yes!";

        randFood.innerHTML= foodSugg;
        randFood.append(yesBtn);
        randomFoodBox.append(randFood);

        yesBtn.addEventListener('click', (event)=>{
            event.preventDefault();
            foodSearch(foodSugg);
            randFood.removeChild(yesBtn);
        })
    });
});


/* === Start of program === */
getNameOfBeer("?page=1&per_page=80");