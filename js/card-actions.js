function createCard(country, dataTier, container) {

  // Container
  let cardContainer = container;

  let fullCard = document.createElement("div");
  fullCard.classList.add("card");
  fullCard.style.minWidth = "250px";
  fullCard.style.maxWidth = "250px";
  fullCard.style.transition = "all 0.2s ease-in-out";
  fullCard.id = country.alpha3Code + dataTier;
  fullCard.setAttribute("data-tier", dataTier);
  fullCard.setAttribute("data-status", "neutral");

  cardContainer.appendChild(fullCard);

  // Card image
  let img = document.createElement("img");
  img.src = country.flag;
  img.classList.add("card-img-top");
  fullCard.appendChild(img);

  // Card content
  let cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  fullCard.appendChild(cardBody);

  // Card information
  let countryName = country.name;
  let capital = country.capital;
  let currencies = country.currencies;
  let borders = country.borders;

  // Country name
  let title = document.createElement("p");
  title.style.fontWeight = "bold";
  title.style.marginBottom = "0";

  let textNode = document.createTextNode(countryName + ":");
  title.appendChild(textNode);
  cardBody.appendChild(title);

  // Capital city
  title = document.createElement("p");

  textNode = document.createTextNode(capital);
  title.appendChild(textNode);
  title.style.marginTop = "0";
  cardBody.appendChild(title);

  // Currency title
  title = document.createElement("p");
  textNode = document.createTextNode("Currency: ");
  title.style.fontWeight = "bold";
  title.style.marginBottom = "0";
  title.appendChild(textNode);
  cardBody.appendChild(title);

  // Currency
  title = document.createElement("p");
  let currency;

  // Get currencies
  _.each(currencies, function(name, index) {
    if (index == 0) currency = name.code + " (" + name.name + ")";
    else currency += ", " + name.code + " (" + name.name + ")";
  });
  textNode = document.createTextNode(currency);
  title.appendChild(textNode);
  cardBody.appendChild(title);

  // Neighbour title
  title = document.createElement("p");
  title.style.fontWeight = "bold";
  title.style.marginBottom = "0";
  textNode = document.createTextNode("Borders: ");
  title.appendChild(textNode);
  cardBody.appendChild(title);

  // Get neighbours
  title = document.createElement("p");
  let borderList;
  _.each(borders, function(name, index) {
    if (index == 0) borderList = name;
    else borderList += ", " + name;
  });
  textNode = document.createTextNode(borderList);
  title.appendChild(textNode);
  cardBody.appendChild(title);

  let btnFooter = document.createElement("a");
  btnFooter.classList.add("btn");
  btnFooter.classList.add("btn-success");
  btnFooter.classList.add("stretched-link");
  btnFooter.innerHTML = "Choose country";
  btnFooter.id = country.name;
  btnFooter.style.cursor = "hand";

  fullCard.appendChild(btnFooter);
  fullCard.addEventListener("click", addCountry);
  fullCard.addEventListener("mouseover", mouseHover);
  fullCard.addEventListener("mouseout", mouseOut);
}

function enableCard(tier) {

  // Get IDs
  let allID = document.querySelectorAll("*[id]");

  // Get all cards
  let allCards = [];
  _.each(allID, function(element, index) {
    if (element.className == "card") {
      allCards.push(element);
    }
  });

  // Get all decks
  let allDecks = [];
  _.each(allID, function(element, index) {
    if (element.className == "card-deck") {
      allDecks
  .push(element);
    }
  });

  // Get countries in the summary
  let allSummaryItems = [];
  _.each(allID, function(element, index) {
    if (element.className == "summaryItem") {
      allSummaryItems.push(element);
    }
  });

  // Enable all cards in the same tier
  for (let i = 0; i < allCards.length; i++) {
    
    // Reset the cards
    if (allCards[i].getAttribute("data-tier") == tier) {
      allCards[i].style.opacity = "1";
      allCards[i].setAttribute("data-status", "neutral");
      allCards[i].lastChild.disabled = "false";
      allCards[i].addEventListener("click", addCountry);

      // Remove the names in the summary
      for (let j = 0; j < allSummaryItems.length; j++) {
        if (allCards[i].lastChild.id == allSummaryItems[j].textContent) {
          let index = allSummaryItems.indexOf(allSummaryItems[j]);
          allSummaryItems[j].parentNode.removeChild(allSummaryItems[j]);
          allSummaryItems.splice(index, 1);
        }
      }
    }

    if (allCards[i].getAttribute("data-tier") > tier) {
      // Remove the names in the summary
      for (let j = 0; j < allSummaryItems.length; j++) {
        if (allCards[i].lastChild.id == allSummaryItems[j].textContent) {
          let index = allSummaryItems.indexOf(allSummaryItems[j]);
          allSummaryItems[j].parentNode.removeChild(allSummaryItems[j]);
          allSummaryItems.splice(index, 1);
        }
      }

      // Remove the card
      allCards[i].parentNode.removeChild(allCards[i]);
    }
  }

  // Remove the decks with no children
  for (let i = 0; i < allDecks
.length; i++) {
    if (!allDecks
  [i].firstChild) {
      allDecks
  [i].remove();
    }
  }
}

function disableCard() {

  // Get IDs
  let allID = document.querySelectorAll("*[id]");

  // Get all cards
  let allCards = [];
  _.each(allID, function(element, index) {
    if (element.className == "card") {
      allCards.push(element);
    }
  });

  // Disable all cards except the one chosen
  for (let i = 0; i < allCards.length; i++) {
    for (let j = 0; j < chosenCountries.length; j++) {
      if (!chosenCountries.includes(allCards[i])) {
        if (
          allCards[i].getAttribute("data-tier") ==
          chosenCountries[j].getAttribute("data-tier")
        ) {
          allCards[i].style.opacity = "0.4";
          allCards[i].setAttribute("data-status", "ignored");
          allCards[i].removeEventListener("click", addCountry);
        }
      }
    }
  }
}


