$(".document").ready(function() {

  let data = {
    sequence: null,
    compSeq: [],
    humanSeq: [],
    ms: [800, 400, 200],
    colors: [green, red, yellow, blue],
    turns: 0
  };

  let controller = {
    init: function() {
      view.init();
    },
    play: function() {
      data.compSeq.push(data.sequence[data.turns]);
      data.turns++;
      console.log("compSeq", data.compSeq, "turns", data.turns);
      // Check for winner, call victory() and return true
      simon.playSeq(data.compSeq);
    },
    start: function() {
      data.sequence = simon.sequence;
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
      $('#test').off('click', controller.init);
      $('#start-button').off('click', controller.start);
      $('#strict-button').off('click', controller.strict);
      $('#green').off('mousedown', press.green);
      $('#red').off('mousedown', press.red);
      $('#yellow').off('mousedown', press.yellow);
      $('#blue').off('mousedown', press.blue);
    },
    togglePower: function() {
      this.checked ? activateEvents() : deactivateEvents();
    }
  };

  let press = {
    green: function() {
      let that = this;
      let greenSound = document.getElementById('green-sound');
      let newSound = greenSound.cloneNode();
      newSound.play();
      $(this).addClass('press');
      setTimeout(() => {press.removeOpacity(that)}, 200);
    },

    red: function() {
      let that = this;
      let redSound = document.getElementById('red-sound');
      let newSound = redSound.cloneNode();
      newSound.play();
      $(this).addClass('press');
      setTimeout(() => {press.removeOpacity(that)}, 200)
    },

    yellow: function() {
      let that = this;
      let yellowSound = document.getElementById('yellow-sound');
      let newSound = yellowSound.cloneNode();
      newSound.play();
      $(this).addClass('press');
      setTimeout(() => {press.removeOpacity(that)}, 200)
    },

    blue: function() {
      let that = this;
      let blueSound = document.getElementById('blue-sound');
      let newSound = blueSound.cloneNode();
      newSound.play();
      $(this).addClass('press');
      setTimeout(() => {press.removeOpacity(that)}, 200)
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
      arr.each(function(value, index) {
      }
    },

    sequence: (function() {
      //Return an array of 20 numbers between 0 and 3
      let arr = new Array(20)
      for (let i = 0; i < arr.length; i++) {
        let rand = Math.floor(Math.random() * 4);
        arr[i] = rand;
      }
      return arr;
    }()),

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
      $('#power').change(events);
    }
  };

  controller.init();
});
