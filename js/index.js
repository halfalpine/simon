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
/*
    play: function(){
      // Add function: check for winner, call victory() and return true
      simon.playSeq(data.compSeq);
      events.activateHumanEvents();
    },
*/

    start: function() {
      data.sequence = simon.makeSequence();
      console.log(data.sequence)
      //data.compSeq.push(data.sequence[0]);
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
      console.log('activated');
    },

    deactivateHumanEvents: function() {
      $('.button').off('mousedown', simon.humanResponse);
      $('.button').toggleClass('lockout');
      console.log('deactivated');
    },

    togglePower: function() {
      this.checked ? events.activateEvents() : events.deactivateEvents();
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
      console.log("humanResponse", "compSeq", data.compSeq);
      console.log("humanResponse", "humanSeq", data.humanSeq);
      // If both arrays are equal...
      if (data.humanSeq.every((el, i) => el === data.compSeq[i])) {
        console.log('match');
        if (data.compSeq.every((el, i) => el === data.humanSeq[i])) {
          console.log('nice!');
        }
      } else {
        console.log('fail!');
        data.humanSeq = [];
        simon.turn(data.compSeq);
      }
      /*
      if (data.humanSeq.every((el, i) => {el === data.compSeq[i]})) {
        console.log('match');
      }
      */
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
      data.compSeq.push(data.sequence[data.turns]);
      // Adjust playback speed, depending on number of turns
      events.deactivateHumanEvents();
      timerID = setInterval(function(){
        // console.log('turns', data.turns, 'index', index);
        // Playback logic
        simon.pushButton(data.compSeq[index]);
        if (index === data.turns) {
          events.activateHumanEvents();
          clearInterval(timerID);
        } else {
          index++;
        }
      }, 1000);
    }
  }

  let view = {
    init: function() {
      $('#power').change(events.togglePower);
      //events.deactivateHumanEvents();
    }
  };

  controller.init();
});
