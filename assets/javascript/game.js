// Star war RBG game - javaScript 

$(function () {

  console.log("Star wars RBC game");

  // ACTOR Object constructor .........................................
  function actor(id, name, healthPoints, attackPower, counterAttackPower, imageFile,minPower) {
    this.actorId = id;
    this.name = name;
    this.healthPoints = healthPoints;
    this.attackPower = attackPower;
    this.counterAttackPower = counterAttackPower;
    this.imageFile = imageFile;
    this.minPower = minPower;
    // Operationproperties
    this.numberOfAttacks = 0;
    this.isSelectedChampion = false;
    this.isSelectedEnemy = false;
    this.isDefitedEnemy = false;
    // funcitons 
    this.increaseAttacks = function () {
      this.numberOfAttacks += 1;
      return this.numberOfAttacks;
    };
    this.increasedAttackPower = function () {
      // base on available attack power, 
      // use a fraction of that power to attack
      let aPwr = Math.floor(Math.random() * this.attackPower);
      if (aPwr < this.minPower) { aPwr = this.minPower; }
      aPwr = aPwr * this.numberOfAttacks;
      return aPwr;
    };
    this.randomCounterAttackPower = function () {
      // base on available counter attack power, 
      // use a fraction of that power to attack
      let caPwr = Math.floor(Math.random() * this.counterAttackPower);
      if (caPwr < this.minPower) { caPwr = this.minPower; }
      return caPwr;
    }
  }

  // ACTOR GENERATOR object  ...............................................
  let actorGenerator = {
    // Properties
    maxHealthPoints: 140,        // must be divisible by two
    maxAttackPower: 20,        // must be divisible by two
    maxCounterAttackPower: 20,  // must be divisible by two
    minPower : 7,
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
    getHealthPoints() {
      // Every actor will receive random health points
      let baseHp = this.maxHealthPoints / 2;
      let hPoints = baseHp + Math.floor(Math.random() * baseHp);
      return hPoints;
    },
    getAttackPower() {
      // every actor will receive random attack powers 
      let basePower = this.maxAttackPower / 2;
      let aPower = basePower + Math.floor(Math.random() * basePower);
      return aPower;
    },
    getCounterAttackPower() {
      // every actor will receive random counter attack powers 
      let basePower = this.maxCounterAttackPower / 2;
      let caPower = basePower + Math.floor(Math.random() * basePower);
      return caPower;
    },
    getActors() {
      // Actors array
      var newActorsArr = [];
      let thisObj = this;
      //for each actor name, create a new actor object
      this.actorDefinitions.forEach(function (actorDef, index) {
        // Get basic properties from actor
        var actorId = actorDef.actorId;
        var actorName = actorDef.name;
        var imageFile = actorDef.image;
        // todo: get random values for teh following numbers
        var healthPoints = thisObj.getHealthPoints();
        var attackPower = thisObj.getAttackPower();
        var counterAttackPower = thisObj.getCounterAttackPower();
        var minPower = thisObj.minPower;
        // Initalize actor
        var obj = new actor(actorId, actorName, healthPoints, attackPower, counterAttackPower, imageFile, minPower);
        // Add actor to the array
        newActorsArr.push(obj);
      })
      // return array of possible actors
      return newActorsArr;
    }
  }

  // GAME Object ...................................................
  let game = {
    // Phases 
    gamePhase0: 'undefined',
    gamePhase1: 'Select-Champion',
    gamePhase2: 'Select-Enemy',
    gamePhase3: 'Start-Attack',
    // Properties
    isGameStarted: false,
    phase: this.gamePhase0,
    possibleActorsArr: [],
    selectedChampion: '',
    selectedEnemy: '',
    wins: 0,
    // Game initialization
    initializeGame(gameType) {
      // Indicate game has started
      this.isGameStarted = true;
      this.phase = this.gamePhase1;
      // Get initial possibel actors
      this.possibleActorsArr = actorGenerator.getActors();
      // Render in teh screen 
      this.displayPossibleActors();
      this.disableAttackButton();
      this.hideResetButton();
      // messages to the user
      this.displayMessageTop('Welcome! Select your character...');
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
      this.phase = this.gamePhase0;
      this.possibleActorsArr = [];
      this.selectedChampion = '';
      this.selectedEnemy = '';
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
      if (msg === '') {
        $('#gameMsgTop').empty();
      } else {
        $('#gameMsgTop').html(msg);
      }
    },
    displayMessageBottom(msg) {
      if (msg === '') {
        $('#gameMstBottom').empty();
      } else {
        $('#gameMstBottom').html(msg);
      }
    },
    displayPossibleActors() {
      // Reset possible actors
      $('#possibleActors').empty();
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
      // reset champion
      $('#selectedChampion').empty();
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
      // Reset selecte enemy display
      $('#selectedEnemy').empty();
      // Build actor card for selected champion
      let actor = this.selectedEnemy;
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
      // Reset possible enemies
      $('#possibleEnemies').empty();
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
          thisObj.phase = thisObj.gamePhase2;
        }
      })
      //log key info
      console.log('Champion: ' + this.selectedChampion.name);
      console.log('is Champion?: ' + this.selectedChampion.isSelectedChampion);
      console.log(this.phase);
      // clear all possible actors
      $('#possibleActors').empty();
      // Display selected actor
      this.displayChampionActor();
      // Display possible enemies
      this.displayPossibleEnemies();
      // messages to the user
      this.displayMessageTop('Select your oponent ...');
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
          actor.isSelectedEnemy = true;
          // Store selected actor (game.selectActor can be used also)
          thisObj.selectedEnemy = actor;
          thisObj.phase = thisObj.gamePhase3;
        }
      })
      //log key info
      console.log('Enemy: ' + this.selectedEnemy.name);
      console.log('is Enemy: ' + this.selectedEnemy.isSelectedEnemy);
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
    },
    attack() {

      // Initial numbers
      console.log('Start En Hp: ' + this.selectedEnemy.healthPoints);
      console.log('max-apwr: ' + this.selectedChampion.attackPower);

      // increase Attack number
      let numAttacks = this.selectedChampion.increaseAttacks();
      console.log('Attack:' + numAttacks);

      // Attack power calculation
      // attackPower = random attack power x Number of attacks
      let aPwrPlus = this.selectedChampion.increasedAttackPower();
      console.log('aPwr++:' + aPwrPlus);

      // Affect the enemy health
      this.selectedEnemy.healthPoints -= aPwrPlus;

      // ending nunmbers
      console.log('end En Hp: ' + this.selectedEnemy.healthPoints);

      // Display possible enemies
      this.displayEnemyActor();

      // messages to the user
      let msg = 'You attacked ' + this.selectedEnemy.name + ' for ' + aPwrPlus + ' points';
      this.displayMessageTop(msg);
      this.displayMessageBottom(''); // clear bottom message
    },
    counterAttack() {

      // Initial Numbers
      console.log('Start Ch Hp: ' + this.selectedChampion.healthPoints);
      console.log('max capwr: ' + this.selectedEnemy.counterAttackPower);

      // counter Attack power calculation
      let caPwr = this.selectedEnemy.randomCounterAttackPower();
      console.log('caPwr:' + caPwr);

      // Affect the champion health
      this.selectedChampion.healthPoints -= caPwr;

      // ending numbers
      console.log('Ch Hp: ' + this.selectedChampion.healthPoints);

      // Display selected actor
      this.displayChampionActor();
      
      // messages to the user
      let msg = this.selectedEnemy.name + ' attacked you back for ' + caPwr + ' points';
      this.displayMessageBottom(msg);

    },
    checkAttackStatus() {
         
       // If champion helath points are zero or less, user lose the game
    // show the reset button

    // if the enemy health points are zero or less, user wins
    // the enemy disapear, and user selects a new contender

    }

  } // end game object

  // Initialize game .....................................................
  game.initializeGame('new');
  console.log('Phase: ' + game.phase);
  console.log(game.possibleActorsArr);

  // Envents selecting the characters to fight
  $(document).on('click', '.actorCard', function () {

    // get actorid from html attributes
    let actorId = $(this).attr('data-actor');
    console.log(actorId);

    // Depending on phase, select champion or enemy
    switch (game.phase) {
      case game.gamePhase1:
        // Select the champion actor
        game.selectChampion(actorId);
        break;
      case game.gamePhase2:
        // Select the enemy
        game.selectEnemy(actorId);
        break;
    }
  })

  $(document).on('click', '#btnAttack', function () {

    console.log('btn attack pressed');

    // Champion attacks enemy
    game.attack();
    // Enemy countes attacks
    game.counterAttack();
    // Determine how stil stands
    game.checkAttackStatus();

  })

  $(document).on('click', '#btnReset', function () {

    console.log('btn reset pressed');



  })





}) //$(function ()