

d3.csv("Assets/bhava-spe.csv").then(function (data) {
  
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  let cards = Array.from(document.getElementsByClassName('card'));
  let game = new flashGame(cards);
  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
      overlay.classList.remove('visible');
      game.startGame(data);
    });
  });

  cards.forEach(card => {
    card.addEventListener('click', () => {
      game.selectCard(card);
    });
  });
});

function setcardvalue(data) {
  //console.log(data.length);
  let cardface = Array.from(document.getElementsByClassName('card'));

  var i;
  for(i=0;i<cardface.length+3&&i<data.length;i++)
  {
    var j=i*3;
    cardface[j].innerHTML = data[i]['dhatu'];
    cardface[j].id=i;
    
    cardface[j+1].innerHTML = data[i]['arth'];
    cardface[j+1].id=i;

    cardface[j+2].innerHTML = data[i]['roop'];
    cardface[j+2].id=i;

  }

} 

function shufflecards() {
  let cards = Array.from(document.getElementsByClassName('card'));
  //console.log(cards.length);
  for(let i=cards.length-1;i>0;i--)
    {
      let randomIndex=Math.floor(Math.random() * (i+1));
      cards[randomIndex].style.order=i;
      cards[i].style.order=randomIndex;
    }

}

function setupCards(data)
{
  const shuffled = data.sort(() => 0.5 - Math.random());

  const slowAndSteady = new Promise(function (resolve, reject) { setcardvalue(shuffled) });

  (async function () {
    try {
      await slowAndSteady;
    }
    catch (err) {
      shufflecards();
    }

  })();

}

 class flashGame {
  constructor(cards)
  {
    this.cardsArray=cards;
  }
 startGame(data){
  this.cardsToCheck = null;
  this.matchedCards = [];
  this.busy = true;
  setTimeout(() => {
    setupCards(data);
    this.busy = false;  
  }, 400);
  this.hideCards();
  

}
hideCards(){
  this.cardsArray.forEach(element => {
    element.classList.remove('matched');
    element.classList.remove('selected');
  });
}
canSelect(card){
//return true;

return (!this.busy && !this.matchedCards.includes(card) && card != this.cardsToCheck);

}

victory(){
  document.getElementById('victory-text').classList.add('visible');
  this.hideCards;
}

selectCard(card){
  if(this.canSelect(card))
  {
    card.classList.add('selected');

    // if
    if(this.cardsToCheck)
      this.checkForCardMatch(card);
    else
     this.cardsToCheck=card;
  }
  else if (!this.busy && !this.matchedCards.includes(card))
  {
    this.cardsToCheck=null;
    card.classList.remove('selected');
  }


}
checkForCardMatch(card)
{
  console.log(card.id);
  console.log(card);
  console.log(this.cardsToCheck.id);
  console.log(this.cardsToCheck);
    if (card.id === this.cardsToCheck.id)
      this.cardMatched(card,this.cardsToCheck);
     else
     this.cardMisMatch(card,this.cardsToCheck);
  this.cardsToCheck = null;
}

cardMatched(card1,card2){
this.matchedCards.push(card1);
this.matchedCards.push(card2);
  card1.classList.remove('selected');
  card2.classList.remove('selected');
  card1.classList.add('matched');
  card2.classList.add('matched');
  if(this.matchedCards.length === this.cardsArray.length)
    this.victory();
}
cardMisMatch(card1,card2){
  this.busy = true;
  setTimeout(() => {
    card1.classList.remove('selected');
    card2.classList.remove('selected');
    this.busy = false;
  }, 1000);

}

}