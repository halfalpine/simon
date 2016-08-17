$(".document").ready(function() {

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

    play: function(){
      data.compSeq.push(data.sequence[data.turns]);
      data.turns++;
      console.log("compSeq", data.compSeq, "turns", data.turns);
      // Add function: check for winner, call victory() and return true
      simon.playSeq(data.compSeq);
      events.activateHumanEvents();
    },

    start: function() {
      data.sequence = simon.sequence;
      controller.play();
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
      $('.button').on('mousedown', press.humanResponse);
    },

    deactivateHumanEvents: function() {
      $('.button').off('mousedown', press.humanResponse);
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

    humanResponse: function(){
      console.log("events.human: this", this);

    }
  };

  // The 'simon' object contains helper functions
  let simon = {

    hasWinner: function(humArr, compArr){
      return humArr.every((value, index) => compArr[index] === humArr[index]);
    },

    playSeq: function(arr) { // arr is data.compSeq
      // Adjust playback speed, depending on number of turns
      if (data.turns < 10) {
        let sTime = data.ms[0];
      } else if (data.turns > 9 && data.turns < 15) {
        let sTime = data.ms[1];
      } else {
        let sTime = data.ms[2];
      }
      let sTime = data.ms[0];
      $('.button').toggleClass('lockout');
      $.each(arr, function(index, value) {
        console.log("value", value, 'index', index);
        setTimeout(function seqTimer() {
          simon.pushButton(value);
          if (index + 1 === arr.length) {
            $('.button').toggleClass('lockout');
          }
        }, (index + 1) * sTime);
      });
    },


    pushButton: function(value, index, array) {
      console.log(value, index, array);
      if (value === 0) press.green();
      else if (value === 1) press.red();
      else if (value === 2) press.yellow()
      else press.blue();
    },

    regGame: (function() {
      if (data.humanMoves > 20) {
        simon.victory;
        return;
      } else {

      }
    }()),

    sequence: (function() {
      //Return an array of 20 numbers between 0 and 3
      let arr = new Array(20)
      for (let i = 0; i < arr.length; i++) {
        let rand = Math.floor(Math.random() * 4);
        arr[i] = rand;
      }
      return arr;
    }()),

    translateToColor: function(num) {
      return data.colors[num];
    }

  }

  let view = {
    init: function() {
      $('#power').change(events.togglePower);
    }
  };

  controller.init();
});
