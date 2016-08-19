$(".document").ready(function() {

  let timerID;

  let data = {
    sequence: null,
    compSeq: [],
    humanSeq: [],
    ms: [1200, 1000, 800],
    colors: [green, red, yellow, blue],
    turns: 0
  };

  let controller = {

    init: function() {
      view.init();
    },

    start: function() {
      data.sequence = simon.makeSequence();
      data.compSeq.push(data.sequence[data.turns]);
      simon.turn();
    },

    strict: function() {
      $('#strict-display').toggleClass('strict-on');
    }
  };

  // This function should togggle all event listeners on and off
  let events = {

    activateEvents: function() {
      $('#start-button').on('mousedown', controller.start);
      $('#strict-button').on('click', controller.strict);
      $('#green').on('mousedown', press.green);
      $('#red').on('mousedown', press.red);
      $('#yellow').on('mousedown', press.yellow);
      $('#blue').on('mousedown', press.blue);
    },

    deactivateEvents: function() {
      $('#test').off('click', controller.init);
      $('#start-button').off('click', controller.start);
      $('#strict-button').off('click', controller.strict);
      $('#green').off('mousedown', press.green);
      $('#red').off('mousedown', press.red);
      $('#yellow').off('mousedown', press.yellow);
      $('#blue').off('mousedown', press.blue);
    },

    activateHumanEvents: function() {
      $('.button').on('mousedown', simon.humanResponse);
      $('.button').toggleClass('lockout');
    },

    deactivateHumanEvents: function() {
      $('.button').off('mousedown', simon.humanResponse);
      $('.button').toggleClass('lockout');
    },

    togglePower: function() {
      /*
      this.checked ? events.activateEvents() : events.deactivateEvents();
      */
      console.log(this);
      if (this.checked) {
        console.log('true');
        events.activateEvents();
      } else {
        console.log('false')
        clearInterval(timerID);
        data.turns = 0;
        data.humanSeq = [];
        data.compSeq = [];
        events.deactivateEvents();
        events.deactivateHumanEvents();
        document.getElementById('count-display').innerHTML = "00";
      }
    }

  };

  let press = {
    green: function() {
      let greenSound = document.getElementById('green-sound');
      let newSound = greenSound.cloneNode();
      newSound.play();
      newSound.remove();
      $('#green').addClass('press');
      setTimeout(() => {press.removeOpacity('#green')}, 200);
    },

    red: function() {
      let redSound = document.getElementById('red-sound');
      let newSound = redSound.cloneNode();
      newSound.play();
      newSound.remove();
      $('#red').addClass('press');
      setTimeout(() => {press.removeOpacity('#red')}, 200)
    },

    yellow: function() {
      let yellowSound = document.getElementById('yellow-sound');
      let newSound = yellowSound.cloneNode();
      newSound.play();
      newSound.remove();
      $('#yellow').addClass('press');
      setTimeout(() => {press.removeOpacity('#yellow')}, 200)
    },

    blue: function() {
      let blueSound = document.getElementById('blue-sound');
      let newSound = blueSound.cloneNode();
      newSound.play();
      newSound.remove();
      $('#blue').addClass('press');
      setTimeout(() => {press.removeOpacity('#blue')}, 200)
    },

    removeOpacity: function(x) {
      $(x).removeClass('press').bind(press.green);
    },
  };

  // The 'simon' object contains helper functions
  let simon = {

    getColorCode: function(button){
      return $(button).data().button;
    },

    hasWinner: function(humArr, compArr){
      return humArr.every((value, index) => compArr[index] === humArr[index]);
    },

    humanResponse: function(){
      let x = simon.getColorCode(this);
      data.humanSeq.push(x);
      if (data.humanSeq.every((el, i) => el === data.compSeq[i])) {
        if (data.compSeq.every((el, i) => el === data.humanSeq[i])) {
          data.turns++;
          data.compSeq.push(data.sequence[data.turns]);
          data.humanSeq = [];
          simon.turn(data.compSeq);
        }
      } else {
        data.humanSeq = [];
        simon.turn(data.compSeq);
      }
    },

    makeSequence: function() {
      //Return an array of 20 numbers between 0 and 3
      let arr = new Array(20);
      for (let i = 0; i < arr.length; i++) {
        let rand = Math.floor(Math.random() * 4);
        arr[i] = rand;
      }
      return arr;
    },

    playback: function(){

    },

    pushButton: function(value, index, array) {
      if (value === 0) press.green();
      else if (value === 1) press.red();
      else if (value === 2) press.yellow()
      else press.blue();
    },

    translateToColor: function(num) {
      return data.colors[num];
    },

    turn: function(arr) { // arr is data.compSeq
      let index = 0;
      setTimeout(() => simon.updateCounter(data.turns), 900);
      if (data.turns === 3) {
        simon.victory();
      } else {
        // Adjust playback speed, depending on number of turns
        events.deactivateHumanEvents();

        document.getElementById('power').checked

        timerID = setInterval(function(){
          // Playback logic
          if (!document.getElementById('power').checked) {
            clearInterval(timerID);
          }
          simon.pushButton(data.compSeq[index]);
          if (index === data.turns) {
            events.activateHumanEvents();
            clearInterval(timerID);
          } else {
            index++;
          }
        }, 1000);
      }
    },

    updateCounter: function(num) {
      let counterDiv = document.getElementById('count-display');
      let str = (num + 1).toString();
      counterDiv.innerHTML = str.length > 1 ?  str : "0" + str;
    },

    victory: function() {
      console.log('you win!');
    }
  }

  let view = {
    init: function() {
      $('#power').change(events.togglePower);
    }
  };

  controller.init();
});
