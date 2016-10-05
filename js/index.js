$(".document").ready(function() {

  let timerID;

  let data = {
    sequence: null,
    compSeq: [],
    humanSeq: [],
    ms: [1200, 1000, 800],
    colors: [green, red, yellow, blue],
    strict: false,
    turns: 0
  };

  let controller = {

    init: function() {
      view.init();
      controller.isIOS();
    },

    isIOS: function() {
      var table = document.getElementById('tabletop');
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        alert('hey');
        table.style.background = 'red';
        var message = document.getElementById('modal-message');
        var modal = document.getElementById('myModal');
        message.innerHTML = "Simon is not supported on iOS at this time :(\n Please try opening Simon on a desktop or laptop computer.";
        modal.style.display = "block";
      }
    },

    start: function() {
      data.sequence = simon.makeSequence();
      data.compSeq.push(data.sequence[data.turns]);
      // events.activateHumanEvents();
      simon.turn();
    },

    strict: function() {
      if (data.strict  === false && data.compSeq.length === 0) {
        simon.strictOn();
      } else if (data.strict === true && data.compSeq.length === 0) {
        simon.strictOff();
      }
    }
  };

  // This function should togggle all event listeners on and off
  let events = {

    activateEvents: function() {
      $('#start-button').on('click', controller.start);
      $('#strict-button').on('click', controller.strict);
      $('#green').on('mousedown', press.green);
      $('#red').on('mousedown', press.red);
      $('#yellow').on('mousedown', press.yellow);
      $('#blue').on('mousedown', press.blue);
    },

    deactivateEvents: function() {
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
      this.checked ? simon.powerOn() : simon.powerOff();
    }

  };

  let press = {
    green: function() {
      let greenSound = document.getElementById('green-sound');
      let newSound = greenSound.cloneNode();
      newSound.play();
      newSound.remove();
      $('#green').addClass('press');
      setTimeout(function() {
        press.removeOpacity('#green');
      }.bind($(this)), 500);
    },

    red: function() {
      let redSound = document.getElementById('red-sound');
      let newSound = redSound.cloneNode();
      newSound.play();
      newSound.remove();
      $('#red').addClass('press');
      setTimeout(function() {
        press.removeOpacity('#red');
      }.bind($(this)), 500);
    },

    yellow: function() {
      let yellowSound = document.getElementById('yellow-sound');
      let newSound = yellowSound.cloneNode();
      newSound.play();
      newSound.remove();
      $('#yellow').addClass('press');
      setTimeout(function() {
        press.removeOpacity('#yellow');
      }.bind($(this)), 500);
    },

    blue: function() {
      let blueSound = document.getElementById('blue-sound');
      let newSound = blueSound.cloneNode();
      newSound.play();
      newSound.remove();
      $('#blue').addClass('press');
      setTimeout(function() {
        press.removeOpacity('#blue');
      }.bind($(this)), 500);
    },

    removeOpacity: function(x) {
      $(x).removeClass('press').bind($(this));
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
        simon.wrongButton();
        if (data.strict){
          simon.powerOff();
          simon.powerOn();
          events.activateHumanEvents();
          data.strict = true;
        } else {
          data.humanSeq = [];
          simon.turn(data.compSeq);
        }
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

    powerOff: function(){
      clearInterval(timerID);
      data.turns = 0;
      data.humanSeq = [];
      data.compSeq = [];
      data.strict = false;
      events.deactivateEvents();
      events.deactivateHumanEvents();
      document.getElementById('count-display').innerHTML = "00";
    },

    powerOn: function() {
      events.activateEvents();
    },

    pushButton: function(value, index, array) {
      if (value === 0) press.green();
      else if (value === 1) press.red();
      else if (value === 2) press.yellow()
      else press.blue();
    },

    strictOff: function() {
      data.strict = false;
      $('#strict-display').removeClass('strict-on');
    },

    strictOn: function() {
      data.strict = true;
      $('#strict-display').addClass('strict-on');
    },

    translateToColor: function(num) {
      return data.colors[num];
    },

    turn: function(arr) { // arr is data.compSeq
      let index = 0;
      setTimeout(function() {
        simon.updateCounter(data.turns);
      }.bind(this), 900);
      if (data.turns === 20) {
        simon.victory();
      } else {
        // Adjust playback speed, depending on number of turns
        events.deactivateHumanEvents();
        timerID = setInterval(function(){
          if (!document.getElementById('power').checked) {
            clearInterval(timerID);
          }
          simon.pushButton(data.compSeq[index]);
          if (index === data.turns) {
            events.activateHumanEvents();
            console.log('human events activated!');
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
      console.log('wrong button')
      let message = document.getElementById('modal-message');
      let modal = document.getElementById('myModal');
      message.innerHTML = "You win!"
      modal.style.display = "block";
      setTimeout(function(){
        modal.style.display = "none";
        simon.powerOff();
        simon.powerOn();
      }, 3000);
    },

    wrongButton: function() {
      let message = document.getElementById('modal-message');
      let modal = document.getElementById('myModal');
      message.innerHTML = "Wrong move!";
      modal.style.display = "block";
      setTimeout(function(){
        modal.style.display = "none";
      }.bind(this), 500);
    }
  }

  let view = {
    init: function() {
      $('#power').change(events.togglePower);
    }
  };

  controller.init();
});
