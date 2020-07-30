

d3.csv("Assets/bhava-spe.csv").then(function (data) {
  
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  let cards = Array.from(document.getElementsByClassName('card'));
  let game = new flashGame(cards,3);
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

function setcardvalue(data, matchType) {
  //console.log(data.length);
  let cardface = Array.from(document.getElementsByClassName('card'));

  var i;
  for(i=0;i<cardface.length+matchType&&i<data.length;i++)
  {
    var j=i*matchType;
    if(matchType == 3)
    {
    cardface[j].innerHTML = data[i]['dhatu'];
    //cardface[j].id=i.toString();
      cardface[j].classList.add(i.toString());

    
    cardface[j+1].innerHTML = data[i]['arth'];
//    cardface[j+1].id=i.toString();
      cardface[j+1].classList.add(i.toString());

    cardface[j+2].innerHTML = data[i]['roop'];
    //cardface[j+2].id=i.toString();
      cardface[j+2].classList.add(i.toString());

    }
    else if(matchType ==2)
    {
      cardface[j].innerHTML = data[i]['dhatu'];
      cardface[j].id = i;

      cardface[j + 1].innerHTML = data[i]['arth'];
      cardface[j + 1].id = i;
    }
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

function setupCards(data,matchType)
{
  const shuffled = data.sort(() => 0.5 - Math.random());

  const slowAndSteady = new Promise(function (resolve, reject) { setcardvalue(shuffled,matchType) });

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
  constructor(cards,matchNumber)
  {
    this.cardsArray=cards;
    this.matchType=matchNumber;
  }
 startGame(data){
  this.cardsToCheck = [];
  this.matchedCards = [];
  this.cardsToCheckClass = null;
  this.cardClass = null;
  this.busy = true;
  setTimeout(() => {
    setupCards(data,this.matchType);
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

return (!this.busy && !this.matchedCards.includes(card) && !this.cardsToCheck.includes(card));

}
victory(){
  document.getElementById('victory-text').classList.add('visible');
  this.hideCards;
}

selectCard(card){
  if(this.canSelect(card))
  {
    this.cardClass=card.className;
    console.log(this.cardClass);
    card.classList.add('selected');

    // if
    if(this.cardsToCheck.length)
      this.checkForCardMatch(card);
    else
    {
      this.cardsToCheckClass = this.cardClass;
      this.cardsToCheck.push(card);
      console.log(this.cardsToCheckClass);
    }
  }
  else if (!this.busy && !this.matchedCards.includes(card))
  {
    //this.cardsToCheck=null;
    //console.log(this.cardsToCheck);

    //console.log("cannnot select but can be removed")
    var index = this.cardsToCheck.indexOf(card);
    //console.log(index);
    this.cardsToCheck.splice(index, 1);
    //console.log(this.cardsToCheck);
    card.classList.remove('selected');
  }


}
checkForCardMatch(card)
{
  let valueCheck=false;
  //console.log(card.id);
  //console.log(card);
  //console.log(this.cardsToCheck[0].id);
  //console.log(this.cardsToCheck[0]);
  /* let checkCardClass = this.cardsToCheck[0].className.split(" ");
  checkCardClass.pop();
  let CardsToCheckClass = checkCardClass.join(" ");
  console.log(CardsToCheckClass); */
if(!valueCheck)
{
if(this.cardsToCheckClass == this.cardClass)
  this.cardMatched(card);
else
  this.cardMisMatch(card);

}  

  else{

  
  var cardsToCheckinnerHTMLs = Array.prototype.slice.call(document.getElementsByClassName(this.cardsToCheckClass)).map(function (x) { return x.innerHTML });
  var cardinnerHTMLs = Array.prototype.slice.call(document.getElementsByClassName(this.cardClass)).map(function (x) { return x.innerHTML });

  console.log(cardsToCheckinnerHTMLs);
  console.log(card.className);
  console.log(cardinnerHTMLs);
  if(this.cardsToCheck.length == 1){
  if(cardsToCheckinnerHTMLs.includes(card.innerHTML) || cardinnerHTMLs.includes(this.cardsToCheck[0].innerHTML))
      this.cardMatched(card);
    else
     this.cardMisMatch(card);
  }
  else 
  {
    if (cardsToCheckinnerHTMLs.includes(card.innerHTML))
      this.cardMatched(card);
    else
      this.cardMisMatch(card);

  }  
}
//this.cardsToCheck = [];
}

cardMatched(card1){
if(this.matchType === 2)
{
  //console.log("in matchtype 2")
  this.matchedCards.push(card1);
  this.matchedCards.push(this.matchedCards[0]);
  
  card1.classList.remove('selected');
  this.cardsToCheck[0].classList.remove('selected');
  card1.classList.add('matched');
  this.cardsToCheck[0].classList.add('matched');
  this.cardsToCheck=[];
  if (this.matchedCards.length === this.cardsArray.length)
    this.victory();
}
else if(this.matchType ==3)
{
  //console.log("in matchtype 3")
this.cardsToCheck.push(card1);
if(this.cardsToCheck.length === 3)
{
  this.cardsToCheck.forEach(element => {
    this.matchedCards.push(element);    
  
  element.classList.remove('selected');
  element.classList.add('matched');
  });
  this.cardsToCheck = [];
  if (this.matchedCards.length === this.cardsArray.length)
    this.victory();
}

}
}

cardMisMatch(card1){
  this.busy = true;
  if(this.cardsToCheck.length == 2)
  {
    //console.log("in cardsmismatch ==2 ");
    setTimeout(() => {
      card1.classList.remove('selected');
      this.busy = false;
    }, 200);
  }
  
  
  else{
    console.log("in cardsmismatch else ");
  setTimeout(() => {
    card1.classList.remove('selected');
    this.cardsToCheck[0].classList.remove('selected');
    this.cardsToCheck=[];
    this.busy = false;
  }, 1000);
  }
  //console.log(this.cardsToCheck);
}

}