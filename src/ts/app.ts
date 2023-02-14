const urlBase = "https://api.punkapi.com/v2/beers";

import RootObject from './beer';

const inputQueryString = document.querySelector("#query-string") as HTMLInputElement;
const searchButton = document.querySelector("#search-button") as HTMLButtonElement;
const randFoodButton = document.querySelector("#random-food-button") as HTMLButtonElement;
const cardWrapper = document.querySelector("#content-box") as HTMLElement;
const cardsHeader = document.querySelector(".food-answer") as HTMLElement;
const beerSelect = document.querySelector("#beerName") as HTMLSelectElement;
const selectedPageList = document.querySelector("#pageList") as HTMLSelectElement;
const randomFoodParagraf = document.createElement("p");
const savedBeerBtn = document.querySelector(".fav-btn") as HTMLButtonElement;
const savedBeerBox = document.querySelector("#fav-list") as HTMLDivElement;
const savedBeerUl = document.querySelector(".fav-ul") as HTMLUListElement;

const loadingGif = document.querySelector(".loadingGif") as HTMLDivElement;  

/* === Save beer info === */ 
interface Card {
    name: string;
    img?: string;
    tagline: string;
    description: string;
    food_pairing: string [];
};

let likedArr:Card[] = []; 

function pushIt(newName: string, newImg:string, newTagline: string, newDesc:string, newFood:string[]){
    const newCard: Card = {
    name: newName,
    img: newImg,
    tagline: newTagline,
    description: newDesc,
    food_pairing: newFood,}
    likedArr.push(newCard);
};


/*============ Fetch URL ================= */
async function getBeerData(param:string, value:string){
    loadingGif.classList.add("loadingGif");
    const response = await fetch(urlBase + param + value);
    const data: RootObject[] = await response.json();
    if (data.length <= 0){
        alert("No food matches your search.");
    }
    return data;
};
/*=========== Hide content ================ */
function hideContent(...elements: HTMLElement[]):void{
    elements.forEach(element =>{
        if(element.tagName === 'SECTION'){cardWrapper.innerHTML = "";}
        else if(element.tagName === "UL"){savedBeerUl.innerHTML = "";}
        else if(element.tagName === "P"){randomFoodParagraf.innerHTML = "";}
        else if(element.tagName === "DIV"){savedBeerBox.style.display = "none";}
        else{console.log("Error in hideContent");}
    });
}

/* === Takes an food input/ food search and makes it so i can use it for a fetch ===*/
function remakeString(str:string):string{
    const sliced = str.replace(/ /g, "_");
    return sliced
};

/* === Takes the user input when searching for food / click the random food option === */
async function foodSearch(foodName:string){
    let foodString = remakeString(foodName);
    loadingGif.style.display = "block";
    loadingGif.classList.add("loadingGif");
    getBeerData("?food=", foodString).then((beer: RootObject[])=>{
        const arrLength : number = beer.length;
        createCard(beer, arrLength);
    });
}

/* === Create Cards that holds beer info === */
let foodArr: string[]= [];
function createCard(beer: RootObject[], arrLength:number){ 
    hideContent(cardWrapper);

    loadingGif.classList.remove("loadingGif");
    for (let i = 0; i < arrLength; i++) {

        foodArr = [];
        const beerCard = document.createElement("div");
        beerCard.className = "beerCard";
        const cardHeader = document.createElement("h3");
        const cardTagline = document.createElement("p");
        cardTagline.className = "cardTagline";
        const cardDesc = document.createElement("p");
        cardDesc.className = "cardDesc";
        const cardFood = document.createElement("p");
        cardFood.className = "cardFood";
        const cardImg = document.createElement("img");

        const saveBeerBtn =document.createElement("button");
        saveBeerBtn.innerText = "Save";
        saveBeerBtn.innerHTML = `<span class="material-symbols-outlined">
        star_rate
        </span>`;

        if(beer[i].image_url === null){
            cardImg.alt = "No img found";
        }else{
            cardImg.src = `${beer[i].image_url}`;
        }

        cardHeader.innerHTML = `${beer[i].name}`;
        cardTagline.innerHTML = `${beer[i].tagline}`;
        cardDesc.innerHTML = ` ${beer[i].description}`;

        // change to check length of food_pairing array
        const foodArrLength = beer[i].food_pairing.length;

        for(let x = 0; x < foodArrLength; x++){
            if(beer[i].food_pairing[x] === undefined){
                cardFood.innerHTML += "";
            }else{
                cardFood.innerHTML += `${beer[i].food_pairing[x]} </br>`; 
                foodArr.push(` ${beer[i].food_pairing[x]}`);             
            }
        }
        beerCard.append(cardHeader, saveBeerBtn, cardTagline, cardDesc, cardFood, cardImg);      
        cardWrapper.append(beerCard);
 
        saveBeerBtn.addEventListener('click', (event) =>{
            event.preventDefault();
            pushIt(beer[i].name, beer[i].image_url, beer[i].tagline, beer[i].description, foodArr);
            saveBeerBtn.innerText = "Saved";
            saveBeerBtn.disabled = true;
            saveBeerBtn.style.cursor = "not-allowed";
        })
    }
}

/* === Make a dropdown with the name of the beer ===*/
async function getNameOfBeer(x: string) {
    const response = await fetch(urlBase + x);
    const data: RootObject[] = await response.json();

    beerSelect.innerHTML = `<option value="empty" selected disabled>--Please choose an option--</option>`;

    data.forEach((element) => { 
        let optionCategory = document.createElement("option");
        optionCategory.innerHTML = element.name;
        beerSelect.append(optionCategory);
    });
}

/* === EventListeners === */
// free text search for food
searchButton.addEventListener("click",async (event) => {
    event.preventDefault();
    hideContent(cardWrapper, savedBeerBox, randomFoodParagraf);
    if(inputQueryString.value.length > 0){
        foodSearch(inputQueryString.value);
    }else{
        alert("Need a input");
    };
});

// Dropdown that shows the name of the beers
beerSelect.addEventListener("change", async(event)=>{
    event.preventDefault();
    hideContent(savedBeerBox, randomFoodParagraf);

    let beerName:string = beerSelect.value;
    const specialChar = /[&*#%]/; // define regex-pattern
    if(specialChar.test(beerName)){
        beerName = beerName.replace(specialChar, "");
    }
    remakeString(beerName);
    getBeerData("?beer_name=", beerName).then((beer: RootObject[])=>{
        const arrLength : number = beer.length;
        createCard(beer, arrLength);
    });
});

// Dropdown that toggle between the API-pages of all beers
selectedPageList.addEventListener("change", async(event)=>{
    event.preventDefault();
    getNameOfBeer(selectedPageList.value);
});

// Gives a random food option 
randFoodButton.addEventListener("click", async (event)=>{
    event.preventDefault();
    hideContent(savedBeerBox);
    let foodSugg: string;

    getBeerData("/", "random").then((beer: RootObject[])=>{
        beer.forEach((element) => {          
            const foodArrLength: number = element.food_pairing.length;
            const random = Math.floor(Math.random() * foodArrLength);
            foodSugg = element.food_pairing[random];
        });
        randomFoodParagraf.innerText= `How about: ${foodSugg}?`;
        foodSearch(foodSugg);
        cardsHeader.append(randomFoodParagraf);
    });
});

// Start of showing saved beer 
// remove -> remove from array Card
savedBeerBtn.addEventListener("click", async (event)=>{
    event.preventDefault();
    hideContent(cardWrapper, savedBeerUl, randomFoodParagraf,savedBeerBox);
    savedBeerBox.style.display = "block";
    showLikedList();
}); 

function showLikedList (){
    for(let i= 0; i< likedArr.length; i++){
        const favLi = document.createElement("li");
        const favLiImg = document.createElement("img") as HTMLImageElement;
        favLi.innerText = likedArr[i].name;

        if(likedArr[i].img === null){
            favLiImg.alt = "No img found";
        }else{
            favLiImg.src = `${likedArr[i].img}`;
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
                <p>${likedArr[i].tagline}</p> 
                <p>${likedArr[i].description}</p> 
                <p>Goes well with: ${likedArr[i].food_pairing}</p>
            `;

            const showLessBtn = document.createElement("button");
            showLessBtn.innerHTML = "Show less";
            favLi.append(showLessBtn, moreInfoList);

            showLessBtn.addEventListener('click', (event)=>{
                event.preventDefault();
                favLi.removeChild(showLessBtn);
                favLi.removeChild(moreInfoList);
                favLi.append(showMoreBtn);
            });
        });
    }
};

/* === Start of program === */
getNameOfBeer("?page=1&per_page=65");
