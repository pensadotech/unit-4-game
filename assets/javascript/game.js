$(function () {

  console.log("Star wars RBC game");

  const gamePhase0 = 'undefined';
  const gamePhase1 = 'Select-Champion';
  const gamePhase2 = 'Select-Enemy';
  const gamePhase3 = 'Strat-Attack';

  // Actor Object constructor
  function actor(id, name, healthPoints, attackPower, counterAttackPower, imageFile) {
    this.actorId = id;
    this.name = name;
    this.healthPoints = healthPoints;
    this.attackPower = attackPower;
    this.counterAttackPower = counterAttackPower;
    this.numberOfAttacks = 0;
    this.imageFile = imageFile;
    this.isSelectedChampion = false;
    this.isSelectedEnemy = false;
    this.isDefitedEnemy = false;
  }

  // Actor generator object 
  let actorGenerator = {
    // Actor fixed properties 
    actorDefinitions: [
      actor1 = {
        actorId: 'A1',
        name: 'Rey',
        image: 'Rey.png'
      },
      actor2 = {
        actorId: 'A2',
        name: 'Anikin Skywalker',
        image: 'anikin-skywalker.jpg'
      },
      actor3 = {
        actorId: 'A3',
        name: 'Darth Maul',
        image: 'DarthMaul.png'
      },
      actor4 = {
        actorId: 'A4',
        name: 'Kylo Ren',
        image: 'KyloRen.jpg'
      }
    ],
    getActors() {
      // Actors array
      var newActorsArr = [];
      //for each actor name, create a new actor object
      this.actorDefinitions.forEach(function (actorDef, index) {
        // Get basic properties from actor
        var actorId = actorDef.actorId;
        var actorName = actorDef.name;
        var imageFile = actorDef.image;
        // todo: get random values for teh following numbers
        var healthPoints = 100;
        var attackPower = 50;
        var counterAttackPower = 30;
        // Initalize actor
        var obj = new actor(actorId, actorName, healthPoints, attackPower, counterAttackPower, imageFile);
        // Add actor to the array
        newActorsArr.push(obj);
      })
      // return array of possible actors
      return newActorsArr;
    }
  }

  let game = {
    // Properties
    isGameStarted: false,
    phase: gamePhase0,
    possibleActorsArr: [],
    selectedChampion: '',
    selectedEnemy: '',
    wins = 0,
    // Game initialization
    initializeGame(gameType) {
      // Indicate game has started
      this.isGameStarted = true;
      this.phase = gamePhase1;
      // Get initial possibel actors
      this.possibleActorsArr = actorGenerator.getActors();
      // Render in teh screen 
      this.displayPossibleActors();
      this.disableAttackButton();
      this.hideResetButton();
      // messages to the user
      this.displayMessageTop('Welcome to the RBG game! Select your character...');
      this.displayMessageBottom('');
      //log key info
      console.log(this.phase);
    },
    resetGame() {
      // clear all elemenst in screen
     $('#possibleActors').empty();
     $('#selectedChampion').empty();
     $('#possibleEnemies').empty();
     $('#selectedEnemy').empty();
     // initialize key values
     this.phase = gamePhase0;
     this.possibleActorsArr = [];
     this.selectedChampion = '';
     this.selectedEnemy='';
     this.wins = 0;
     // Restart the game
     this.initializeGame('restart');
   },
    disableAttackButton() {
      $('#btnAttack').removeClass('btn-lg');
      $('#btnAttack').removeClass('btn-danger');
      $('#btnAttack').addClass('btn-dark');
      $('#btnAttack').addClass('disabled');
    },
    enableAttackButton() {
      $('#btnAttack').removeClass('btn-dark');
      $('#btnAttack').addClass('btn-danger');
      $('#btnAttack').addClass('btn-lg');
      $('#btnAttack').removeClass('disabled');
    },
    hideResetButton() {
      $('#btnReset').addClass('d-none');
    },
    showResetButton() {
      $('#btnReset').addClass('d-block');
    },
    displayMessageTop(msg) {
       if (msg === ''){
        $('#gameMsgTop').empty();
       }
       else {
        $('#gameMsgTop').html(msg);
       }
    },
    displayMessageBottom(msg) {
      if (msg === ''){
        $('#gameMstBottom').empty();
       }
       else {
        $('#gameMstBottom').html(msg);
       }
    },
    displayPossibleActors() {
      // Build actor card for each pre-defined actors
      this.possibleActorsArr.forEach(function (actor) {
        // Build dive for possible actors
        let actorCard = $(`
         <div class='actorCard imgRnd10 d-inline-block' data-actor="${actor.actorId}">
            <span id="actorName" class="d-block">${actor.name}</span>
            <img class="actorImage img-fluid imgRnd10" src="./assets/images/${actor.imageFile}" alt="${actor.name}">
            <span id="hpoints" class="d-block">${actor.healthPoints}</span>
          </div>
        `)
        // Apend to possible actors
        $('#possibleActors').append(actorCard);
      })
    },
    displayChampionActor() {
      // Build actor card for selected champion
      let actor = this.selectedChampion;
      // Build dive for possible actors
      let actorCard = $(`
      <div class='actorCard championCard imgRnd10 d-inline-block' data-actor="${actor.actorId}">
      <span id="actorName" class="d-block">${actor.name}</span>
      <img class="actorImage img-fluid imgRnd10" src="./assets/images/${actor.imageFile}" alt="${actor.name}">
      <span id="hpoints" class="d-block">${actor.healthPoints}</span>
      </div>
       `)
      // Apend to possible actors
      $('#selectedChampion').append(actorCard);
    },
    displayEnemyActor() {
      // Build actor card for selected champion
      let actor = this.isSelectedEnemy;
      // Build dive for possible actors
      let actorCard = $(`
      <div class='actorCard enemyCard defenderCard imgRnd10 d-inline-block' data-actor="${actor.actorId}">
      <span id="actorName" class="d-block">${actor.name}</span>
      <img class="actorImage img-fluid imgRnd10" src="./assets/images/${actor.imageFile}" alt="${actor.name}">
      <span id="hpoints" class="d-block">${actor.healthPoints}</span>
      </div>
       `)
      // Apend to possible actors
      $('#selectedEnemy').append(actorCard);
    },
    displayPossibleEnemies() {
      this.possibleActorsArr.forEach(function (actor) {
        // Not champion, but remainder actors are possible enemies
        if (!actor.isSelectedChampion && !actor.isSelectedEnemy && !actor.isDefitedEnemy) {
          // Build dive for possible actors
          let actorCard = $(`
              <div class='actorCard enemyCard imgRnd10 d-inline-block' data-actor="${actor.actorId}">
              <span id="actorName" class="d-block">${actor.name}</span>
              <img class="actorImage img-fluid imgRnd10" src="./assets/images/${actor.imageFile}" alt="${actor.name}">
              <span id="hpoints" class="d-block">${actor.healthPoints}</span>
                </div>
              `)
          // Apend to possible actors
          $('#possibleEnemies').append(actorCard);
        }
      })
    },
    selectChampion(actorId) {
      // store 'this' to make it available
      // inside the foreach
      var thisObj = this;
      // Select the chamption
      this.possibleActorsArr.forEach(function (actor) {
        // if actorID matches, mark as chamption
        if (actor.actorId === actorId) {
          actor.isSelectedChampion = true;
          // Store selected actor (game.selectActor can be used also)
          thisObj.selectedChampion = actor;
          thisObj.phase = gamePhase2;
        }
      })
      //log key info
      console.log('Champion: ' + this.selectedChampion.name + ' Ch: ' + this.selectedChampion.isSelectedChampion);
      console.log(this.phase);
      // clear all possible actors
      $('#possibleActors').empty();
      // Display selected actor
      this.displayChampionActor();
      // Display possible enemies
      this.displayPossibleEnemies();
      // messages to the user
      this.displayMessageTop('Now, select your first oponent!');
      this.displayMessageBottom('');
    },
    selectEnemy(actorId) {
      // store 'this' to make it available
      // inside the foreach
      var thisObj = this;
      // Select the chamption
      this.possibleActorsArr.forEach(function (actor) {
        // if actorID matches, mark as chamption
        if (actor.actorId === actorId) {
          actor.isSelectedChampion = true;
          // Store selected actor (game.selectActor can be used also)
          thisObj.selectedEnemy = actor;
          thisObj.phase = gamePhase3;
        }
      })
      //log key info
      console.log('Enemy: ' + this.isSelectedEnemy.name + ' En: ' + this.selectedEnemy.isSelectedEnemy);
      console.log(this.phase);
      // clear all possible actors
      $('#possibleEnemies').empty();
      // re-display remaining possible enemies
      this.displayPossibleEnemies();
      // display enemy
      this.displayEnemyActor();
      // enable attack
      this.enableAttackButton();
      // messages to the user
      this.displayMessageTop('Ready? press the Attack button!');
      this.displayMessageBottom('');
    }

  } // end game object

  // Initialize game
  game.initializeGame('new');
  console.log('Phase: ' + game.phase);
  
  // Envents selecting teh characters to fight
  $(document).on('click', '.actorCard', function () {

    // get actorid from html attributes
    let actorId = $(this).attr('data-actor');
    console.log(actorId);
    
    // Depending on phase, select champion or enemy
    switch (game.phase) {
      case gamePhase1:
        // Select the champion actor
        game.selectChampion(actorId);
        break;
      case gamePhase2:
        // Select the enemy
        game.selectEnemy(actorId);
        break;
    }
  })

  $(document).on('click','#btnAttack', function() {

    console.log('btn attack pressed');
    
    // make an attack from champion to enemy 

    // If champion helath points are zero or less, user lose the game
    // show the reset button

    // if the enemy health points are zero or less, user wins
    // teh enemy disapear, and user selects a new contender


  })

  $(document).on('click','#btnReset', function() {

    console.log('btn attack pressed');

  }





}) //$(function ()