const urlBase = "https://api.punkapi.com/v2/beers";

import RootObject from './beer';

const inputQueryString = document.querySelector("#query-string") as HTMLInputElement;
const buttonSearch = document.querySelector("#search-button") as HTMLButtonElement;
const buttonRandFood = document.querySelector("#random-food-button") as HTMLButtonElement;
const wrapper = document.querySelector("#content-box") as HTMLElement;
const selectBeer = document.querySelector("#beerName") as HTMLSelectElement;
const randomFoodBox = document.querySelector("#random-food") as HTMLTableSectionElement;
const selectedPageList = document.querySelector("#pageList") as HTMLSelectElement;
const randomFoodParagraf = document.createElement("p");

/* === Save beer info === */ 
interface Card {
    name: string;
    img?: string;
    tagline: string;
    description: string;
    food_pairing: string [];
};

let likedArr:Card[] = []; 

function pushit(x: string, y:string, e: string, r:string, f:string[]){
    let derp: Card = {
    name: x,
    img: y,
    tagline: e,
    description: r,
    food_pairing: f}
    likedArr.push(derp);
    console.log(likedArr)
};


/*============ Fetch URL ================= */
async function getBeerData(param:string, value:string){
    const response = await fetch(urlBase + param + value);
    const data: RootObject[] = await response.json();
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
/* === Takes the user input when searching for food / click the random food option === */
async function foodSearch(foodName:string){

    let foodString = remakeString(foodName);

    getBeerData("?food=", foodString).then((beer: RootObject[])=>{
        const arrLength : number = beer.length;
        createCard(beer, arrLength);
    });
}

let foodArr: string[]= [];
/* === Create Cards that holds beer info === */
function createCard(beer: RootObject[], o:number){ 
    wrapper.innerHTML= "";
    for (let i = 0; i < o; i++) {

        foodArr = [];
        const beerCard = document.createElement("div");
        beerCard.className = "beerCard";
        const cardHeader = document.createElement("h3");
        const cardTagline = document.createElement("p");
        const cardDesc = document.createElement("p");
        const cardFood = document.createElement("p");
        const cardImg = document.createElement("img");

        const saveBeer =document.createElement("button");
        saveBeer.innerText = "Save";

        if(beer[i].image_url === null){
            cardImg.alt = "Oh, there is no img to this beer"
        }else{
            cardImg.src = `${beer[i].image_url}`;
            cardImg.style.height= "250px";
            cardImg.style.width = "100px";
        }

        cardHeader.innerHTML = `${beer[i].name}`;
        cardTagline.innerHTML = `${beer[i].tagline}`;
        cardDesc.innerHTML = ` ${beer[i].description}`;

        // change to check length of food_pairing array
        const foodArrLength = beer[i].food_pairing.length;
        console.log(foodArrLength);
        for(let x = 0; x < foodArrLength; x++){
            if(beer[i].food_pairing[x] === undefined){
                console.log("Herp");
                cardFood.innerHTML += "";
            }else{
                cardFood.innerHTML += `${beer[i].food_pairing[x]} </br>`; 
                foodArr.push(beer[i].food_pairing[x]);             
            }
        }
        beerCard.append(cardHeader, saveBeer, cardTagline, cardDesc, cardFood, cardImg);      
        wrapper.append(beerCard);
 
        saveBeer.addEventListener('click', (event) =>{
            event.preventDefault();
            pushit(beer[i].name, beer[i].image_url, beer[i].tagline, beer[i].description, foodArr); 
        })
    }
}

/* === Make a dropdown with the name of the beer ===*/
async function getNameOfBeer(x: string) {
    const response = await fetch(urlBase + x);
    const data: RootObject[] = await response.json();

    selectBeer.innerHTML = `<option value="empty" selected disabled>--Please choose an option--</option>`;

    data.forEach((element) => { 
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
selectedPageList.addEventListener("change", async(event)=>{
    event.preventDefault();
    selectBeer.innerHTML = "";
    getNameOfBeer(selectedPageList.value);
});

// Gives a random food option 
buttonRandFood.addEventListener("click", async (event)=>{
    event.preventDefault();
    let foodSugg: string;

    getBeerData("/", "random").then((beer: RootObject[])=>{
        beer.forEach((element) => {          
            const foodArrLength: number = element.food_pairing.length;
            const random = Math.floor(Math.random() * foodArrLength);
            foodSugg = element.food_pairing[random];
        });

        buttonRandFood.innerText = "Give me another one";
        const yesBtn = document.createElement("button");
        yesBtn.innerText = "Yes!";

        randomFoodParagraf.innerHTML= foodSugg;
        randomFoodParagraf.append(yesBtn);
        randomFoodBox.append(randomFoodParagraf);

        yesBtn.addEventListener('click', (event)=>{
            event.preventDefault();
            foodSearch(foodSugg);
            randomFoodParagraf.removeChild(yesBtn);
        })
    });
});

// Start of showing saved beer 
// remove -> remove from array Card
const savedBeerBtn = document.querySelector(".fav-btn") as HTMLButtonElement;
const savedBeerBox = document.querySelector("#fav-list") as HTMLDivElement;
const savedBeerUl= document.querySelector(".fav-ul") as HTMLUListElement;

savedBeerBox.style.display = "none";

function showLikedList (){
    for(let i= 0; i< likedArr.length; i++){
        const favLi = document.createElement("li");
        const favLiImg = document.createElement("img") as HTMLImageElement;
        favLi.innerText = likedArr[i].name;

        if(likedArr[i].img === null){
            favLiImg.alt = "No img found"
        }else{
            favLiImg.src = `${likedArr[i].img}`;
            // toggle class 
            favLiImg.style.height= "100px";
            favLiImg.style.width = "30px";
        }
    
        favLi.append(favLiImg);
        savedBeerUl.append(favLi);

        const showMoreBtn = document.createElement("button");
        showMoreBtn.innerText ="Show more";
        favLi.append(showMoreBtn);

        showMoreBtn.addEventListener('click', (event)=>{
            event.preventDefault();
            favLi.removeChild(showMoreBtn);

            const moreInfoList = document.createElement("div");
            moreInfoList.innerHTML = `
                <p>Tagline: ${likedArr[i].tagline}</p> 
                <p>Description: ${likedArr[i].description}</p> 
                <p>Food: ${likedArr[i].food_pairing}</p>
            `;

            const showLessBtn = document.createElement("button");
            showLessBtn.innerHTML = "Show less";
            favLi.append(moreInfoList, showLessBtn);

            showLessBtn.addEventListener('click', (event)=>{
                event.preventDefault();
                favLi.removeChild(showLessBtn);
                favLi.removeChild(moreInfoList);
                favLi.append(showMoreBtn);
            });
        });
    }

};

savedBeerBtn.addEventListener("click", async (event)=>{
    event.preventDefault();
    wrapper.innerHTML= "";
    savedBeerUl.innerHTML = "";
    savedBeerBox.style.display = "block";
    showLikedList();
}); 


/* === Start of program === */
getNameOfBeer("?page=1&per_page=65");


// When cards loads -> needs a output  

