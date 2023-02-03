const urlBase = "https://api.punkapi.com/v2/beers";


const inputQueryString = document.querySelector("#query-string") as HTMLInputElement;
const buttonSearch = document.querySelector("#search-button") as HTMLButtonElement;
const buttonRandFood = document.querySelector("#random-food-button") as HTMLButtonElement;
const wrapper = document.querySelector("#content-box") as HTMLElement;
const selectCategories = document.querySelector("#categories") as HTMLSelectElement;

/*============ Fetch URL ================= */
async function getBeerData(param:string, value:string){
    const response = await fetch(urlBase + param + value);
    const data: object[] = await response.json();
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

/* === Create Cards that holds beer info === */
function createCard(beer: any, o:number){ //beer: any <- must change that
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
            cardFood.innerHTML += `${beer[i].food_pairing[x]} </br>`;
        }

        beerCard.append(cardHeader, cardTagline, cardDesc, cardFood,cardImg);      
        wrapper.append(beerCard);
    }
}

/* === Make a dropdown with the name of the beer ===*/
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

/* === EventListeners === */
// free text search for food
buttonSearch.addEventListener("click",async (event) => {
    event.preventDefault();
    wrapper.innerHTML= "";
    if(inputQueryString.value.length > 0){
        let foodString = remakeString(inputQueryString.value);

        getBeerData("?food=", foodString).then((beer)=>{
            const arrLength : number = beer.length;
            createCard(beer, arrLength);
        });
    }else{
        alert("Need a input");
    };

});
// Dropdown that shows the name of the beers
selectCategories.addEventListener("change", async(event)=>{
    event.preventDefault();
    getBeerData("?beer_name=", selectCategories.value).then((beer)=>{
        const arrLength : number = beer.length;
        createCard(beer, arrLength);
    });
});

// Gives a random food option 
buttonRandFood.addEventListener("click", async (event)=>{
    event.preventDefault();
    getBeerData("/", "random").then((beer)=>{
        beer.forEach((element:any) => { // another any,
            //console.log(element);           
            const foodArrLength: number = element.food_pairing.length;
            const random = Math.floor(Math.random() * foodArrLength)
            console.log(element.food_pairing[random]);            
        });
    });
});

/* === Start of program === */
getNameOfBeer();