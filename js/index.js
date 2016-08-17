$(".document").ready(function() {

  let data = {
    sequence: null,
    compSeq: [],
    humanSeq: [],
    ms: [800, 400, 200],
    colors: ['green', 'red', 'yellow', 'blue'],
    turns: 0
  };

  let controller = {
    init: function() {
      view.init();
    },
    play: function() {
      data.compSeq.push(data.sequence[data.turns]);
      data.turns++;
      console.log('turns', data.turns);
      console.log("compSeq", data.compSeq, "turns", data.turns);
      // Add function: Check for winner, call victory() and return true
      simon.playSeq(data.compSeq);
    },
    start: function() {
      data.sequence = simon.sequence();
      controller.play();
    },
    strict: function() {
      $('#strict-display').toggleClass('strict-on');
    }
  };

  let events = {
     activateEvents: function() {
      // $('#test').on('click', controller.init);
      $('#start-button').on('mousedown', controller.start);
      $('#strict-button').on('click', controller.strict);
      $('#green').on('mousedown', press.green);
      $('#red').on('mousedown', press.red);
      $('#yellow').on('mousedown', press.yellow);
      $('#blue').on('mousedown', press.blue);
    },
    deactivateEvents: function() {
      $('#start-button').off('click');
      $('#strict-button').off('click');
      $('#green').off('mousedown');
      $('#red').off('mousedown');
      $('#yellow').off('mousedown');
      $('#blue').off('mousedown');
    },
    togglePower: function() {
      this.checked ? events.activateEvents() : events.deactivateEvents();
    }
  };

  let press = {
    green: function() {
      console.log('in green');
      let greenSound = document.getElementById('green-sound');
      let newSound = greenSound.cloneNode();
      newSound.play();
      $(greenSound).addClass('press');
      setTimeout(() => {press.removeOpacity(greenSound)}, 200);
    },

    red: function() {
      console.log('in red');

      let redSound = document.getElementById('red-sound');
      let newSound = redSound.cloneNode();
      newSound.play();
      $(redSound).addClass('press');
      setTimeout(() => {press.removeOpacity(redSound)}, 200)
    },

    yellow: function() {
      console.log('in yellow');

      let yellowSound = document.getElementById('yellow-sound');
      let newSound = yellowSound.cloneNode();
      newSound.play();
      $(yellowSound).addClass('press');
      setTimeout(() => {press.removeOpacity(yellowSound)}, 200)
    },

    blue: function() {
      console.log('in blue');

      let blueSound = document.getElementById('blue-sound');
      let newSound = blueSound.cloneNode();
      newSound.play();
      $(blueSound).addClass('press');
      setTimeout(() => {press.removeOpacity(blueSound)}, 200)
    },

    removeOpacity: function(x) {
      $(x).removeClass('press').bind(press.green);
    }
  };

  // The 'simon' object contains helper functions
  let simon = {

    hasWinner: function(humArr, compArr){
      return humArr.every((value, index) => compArr[index] === humArr[index]);
    },

    translateToColor: function(num) {
      return data.colors[num];
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
      events.deactivateEvents();
      $.each(arr, function(index, value){
        console.log("value", value, 'index', index);
        setTimeout(function seqTimer() {
          simon.pushButton(value);
        }, (index + 1) * sTime);
      });
      // events.activateEvents();
    },

    pushButton: function(value) {
      if (value === 0) press.green();
      else if (value === 1) press.red();
      else if (value === 2) press.yellow();
      else press.blue();
    },

    sequence: function() {
      //Return an array of 20 numbers between 0 and 3
      let arr = new Array(20)
      for (let i = 0; i < arr.length; i++) {
        let rand = Math.floor(Math.random() * 4);
        arr[i] = rand;
      }
      return arr;
    },

    regGame: (function() {
      if (data.humanMoves > 20) {
        simon.victory;
        return;
      } else {

      }
    }())
  }

  let view = {
    init: function() {
      $('#power').change(events.togglePower);
    }
  };

  controller.init();
});
