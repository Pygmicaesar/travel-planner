/**
 * Yay, global variables...
 */

let allCountries = [];
let chosenCountries = [];
let username;

(function getUsername() {

  let usernameBtn = document.querySelector("#username-button");
  usernameBtn.addEventListener("click", validateUsername);
  let summaryBox = document.querySelector(".summary-box");
  summaryBox.style.display = "none";

  let usernameInput = document.querySelector("#username-input");
  usernameInput.addEventListener("keyup", function(event) {

    if (event.keyCode === 13) {
      event.preventDefault();
      validateUsername();
    }

  });
})();

function validateUsername() {

  let usernameInput = document.querySelector("#username-input");
  if (usernameInput.value.length > 2) {
    username = usernameInput.value;

    // Show a summary
    let summaryBox = document.querySelector(".summary-box");
    summaryBox.style.display = "block";
    summaryBox.childNodes[1].childNodes[1].textContent =
      username + ": " + summaryBox.childNodes[1].childNodes[1].textContent;

    // Remove the input elements
    let removableDiv = document.querySelector(".name-input");
    while (removableDiv.firstChild) {
      removableDiv.removeChild(removableDiv.firstChild);
    }
    removableDiv.remove();
    getCountryAPI();
  } else {
    alert("Please, enter a name with more than two characters!");
  }
}

function getCountryAPI() {
  fetch("https://restcountries.eu/rest/v2/all")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      createInitialCountries(data);
    });
}

function createInitialCountries(data) {
  
  // Fetch API data
  let countryData = data;
  allCountries = data;

  // Print out three random countries
  let randomIndex = getRandomCountry(3);
  let countriesFound = false;

  // Look for three countries
  while (!countriesFound) {
    
    // Iterate through the indices
    _.each(countryData, function(name, index) {
      for (let i = 0; i < randomIndex.length; i++) {
        if (randomIndex[i] == index) {
          if (name.borders.length > 2) {
            chosenCountries.push(name);
          }
        }
      }
    });

    if (chosenCountries.length != 3) {
      randomIndex = getRandomCountry(3 - chosenCountries.length);
    } else {
      countriesFound = true;
    }
  }

  let deck = createNewDeck();
  for (let i = 0; i < chosenCountries.length; i++) {
    createCard(chosenCountries[i], 0, deck);
  }

  // Add an event listener for the summary button
  let itineraryBtn = document.querySelector("#itinerary-button");
  itineraryBtn.addEventListener("click", createItinenary);

  // Empty the chosen countries array.
  chosenCountries = [];
}

/**
 * Whole lotta event listeners
 */

function createItinenary() {

  // Don't do anything if no countries have been chosen 
  if (document.querySelector(".chosenCountries").childNodes.length > 0) {
    let itineraryBtn = document.querySelector("#itinerary-button");
    if (itineraryBtn.textContent == "Itinerary") {

      let itineraryBox = document.querySelector(".summary-box");
      let countryObjects = [];

      // Iterate through the countries
      for (let i = 0; i < chosenCountries.length; i++) {

        _.each(allCountries, function(cntry, index) {
          if (
            cntry.alpha3Code + chosenCountries[i].getAttribute("data-tier") ==
            chosenCountries[i].id
          ) {
            countryObjects.push(cntry);
          }
        });
      }

      // Get weather data from DarkSky API
      for (let i = 0; i < countryObjects.length; i++) {

        let lat = countryObjects[i].latlng[0];
        let lng = countryObjects[i].latlng[1];
        fetch(
          "https://corsanywhere.herokuapp.com/https://api.darksky.net/forecast/bf31061d2884fff586880f5cb757d7f8/" +
            lat +
            "," +
            lng,
          { mode: "cors" }
        )
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            setItineraryData(data, chosenCountries[i], "weather");
          });
      }

      // Get the distances between capital cities
      for (let i = 0; i < countryObjects.length - 1; i++) {

        let startCity = countryObjects[i].capital;
        let endCity = countryObjects[i + 1].capital;

        fetch(
          "https://corsanywhere.herokuapp.com/http://www.distance24.org/route.json?stops=" +
            startCity +
            "|" +
            endCity
        )
          .then(function(response) {
            if (response.status !== 200) {
              console.log("Error status: " + response.status);
            } else {
              return response.json();
            }
          })
          .then(function(data) {
            setItineraryData(data, chosenCountries[i], "distance");
          });
      }

      itineraryBtn.textContent = "Minimize";

    } else {

      // Remove data
      itineraryBtn.textContent = "Itinerary";
      let infoList = document.querySelectorAll("ul");
      for (let k = 0; k < infoList.length; k++) {

        // Remove all children
        while (infoList[k].firstChild) {
          infoList[k].removeChild(infoList[k].firstChild);
        }
        infoList[k].remove();
      }
    }
  }
}

function mouseHover() {
  let card = document.querySelector("#" + this.id);
  if (card != null && card.getAttribute("data-status") == "neutral") {
    card.style.boxShadow = "5px 5px 10px #999999";
    card.style.position = "relative";
    card.style.zIndex = "3";
  }
}

function mouseOut() {
  let card = document.querySelector("#" + this.id);
  if (card != null && card.getAttribute("data-status") == "neutral") {
    card.style.boxShadow = "0px 0px 0px #999999";
    card.style.zIndex = "1";
  }
}

function setItineraryData(data, country, identifier) {

  let summaryCountries = document.querySelector(".chosenCountries");

  for (let i = 0; i < chosenCountries.length; i++) {

    if (
      summaryCountries.childNodes[i].textContent ==
      country.childNodes[1].childNodes[0].textContent.split(":")[0]
    ) {

      let parent = summaryCountries.childNodes[i];

      switch (identifier) {
        case "weather":
          // Infolista
          let infoList = document.createElement("ul");
          parent.appendChild(infoList);

          for (let j = 0; j < 3; j++) {

            let newDay = document.createElement("li");
            newDay.textContent = "Day " + parseInt(j + 1) + ": ";
            infoList.appendChild(newDay);

            let weatherContainer = document.createElement("ul");
            infoList.appendChild(weatherContainer);

            let infoNodeGeneral = document.createElement("li");
            infoNodeGeneral.innerHTML =
              "General info: " + data.daily.data[j].summary;
            weatherContainer.appendChild(infoNodeGeneral);

            let infoNodeTempHigh = document.createElement("li");
            infoNodeTempHigh.innerHTML =
              "Highest temperature: " +
              Math.round(
                (parseInt(data.daily.data[j].temperatureHigh) - 32) * 0.5556
              ) +
              " °C";
            weatherContainer.appendChild(infoNodeTempHigh);

            let infoNodeTempLow = document.createElement("li");
            infoNodeTempLow.innerHTML =
              "Lowest temperature: " +
              Math.round(
                (parseInt(data.daily.data[j].temperatureLow) - 32) * 0.5556
              ) +
              " °C";
            weatherContainer.appendChild(infoNodeTempLow);
          }
          break;
      }
    }
  }
}

// Add a new tier of border neighbours
function addTier(country, dataTier) {

  let borders = [];
  let countryObject;
  let tempAllCountries = allCountries;

  _.each(tempAllCountries, function(cntry, index) {
    if (cntry.alpha3Code + (dataTier - 1) == country.id) {

      for (let i = 0; i < chosenCountries.length; i++) {

        let chosenCountryParsed = chosenCountries[i].id.split(/\d/)[0];

        if (cntry.borders.includes(chosenCountryParsed)) {
          let removableElement = cntry.borders.indexOf(chosenCountryParsed);
          cntry.borders.splice(removableElement, 1);
        }
      }
      countryObject = cntry.borders;
    }
  });

  _.each(tempAllCountries, function(cntry, index) {
    for (let i = 0; i < countryObject.length; i++) {
      if (countryObject[i] == cntry.alpha3Code) {
        borders.push(cntry);
      }
    }
  });

  if (borders == 0) {
    alert("You have visited all the possible countries!");
    createItinenary();
  }
  let deck = createNewDeck(country, dataTier);
  for (let i = 0; i < borders.length; i++) {
    createCard(borders[i], dataTier, deck);
  }
}

function createNewDeck(country, dataTier) {
  let deck = document.createElement("div");
  deck.classList.add("card-deck");
  deck.style.paddingBottom = "80px";
  deck.id = country + dataTier + "deck";

  let jumbotron = document.querySelector("#jumbotron");
  jumbotron.appendChild(deck);

  return deck;
}
