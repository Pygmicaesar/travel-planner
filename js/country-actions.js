function addCountry() {

  // Don't register key presses while viewing the itinerary 
  if (document.querySelectorAll("ul").length == 0) {
    card = document.querySelector("#" + this.id);

    if (card.getAttribute("data-status") == "neutral") {

      // Add a card to the summary
      let summaryContainer = document.querySelector(".chosenCountries");
      let cardName = document.createElement("div");
      cardName.id = card.id + "list";
      cardName.className = "summaryItem";
      cardName.innerHTML = "<b>" + card.lastChild.id + "</b>";
      summaryContainer.appendChild(cardName);

      // Add card and highlight it
      chosenCountries.push(card);
      card.style.boxShadow = "5px 5px 10px #999999";
      card.style.position = "relative";
      card.style.zIndex = "3";
      // Set the data attributes and the correct tier
      card.setAttribute("data-status", "chosen");
      disableCard();
      addTier(card, parseInt(card.getAttribute("data-tier")) + 1);
    }
    // Get the card tier and enable countries in the same tier
    else if (card.getAttribute("data-status") == "chosen") {

      for (let k = 0; k < chosenCountries.length; k++) {
        if (chosenCountries[k].id == card.id) {
          chosenCountries.splice(k, chosenCountries.length - k);
        }
      }
      enableCard(card.getAttribute("data-tier"));
    }
  }
}

function getRandomCountry(amount) {
  let countries = [];
  for (let i = 0; i < amount; i++) {
    let randNum = Math.round(Math.random() * 249);
    if (!countries.includes(randNum)) {
      countries.push(randNum);
    }
  }
  return countries;
}