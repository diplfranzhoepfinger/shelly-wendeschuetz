/* 
 * This file is part of the shelly-wendeschuetz distribution (https://github.com/diplfranzhoepfinger/shelly-wendeschuetz).
 * Copyright (c) 2023 Franz Höpfinger.
 * 
 * This program is free software: you can redistribute it and/or modify  
 * it under the terms of the GNU General Public License as published by  
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License 
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


let greeting = "Anlage Bereit";

/*
 * Handles der Timer
 */
let timerVorwaertsTimer = null;
let timerVorwaertsPauseTimer = null;
let timerRueckwaertsTimer = null;
let timerRueckwaertsPauseTimer = null;

/*
 * Konfiguration der Zeiten
 */
let CONFIG = {
  pause:              3 * 1000, // 3  s   Pause
  vorwaerts:    10 * 60 * 1000, // 10 min Vorwärts
  rueckwaerts:        3 * 1000, // 3  s   Rückwärts
};



/*
 * Funktion AUS, schaltet beide Ausgänge aus
 */
function aus() {
  print("Switch aus");
  Shelly.call("Switch.set", {'id': 0, 'on': false});
  Shelly.call("Switch.set", {'id': 1, 'on': false});
}

/*
 * Funktion Vorwärts, schaltet Ausgang 1 ein und Ausgang 2 aus. 
 */
function vorwaerts() {
  print("Switch vorwaerts");
  Shelly.call("Switch.set", {'id': 0, 'on': true});
  Shelly.call("Switch.set", {'id': 1, 'on': false});
}

/*
 * Funktion Rückwärts, schaltet Ausgang 1 aus und Ausgang 2 ein. 
 */
function rueckwaerts() {
  print("Switch rueckwaerts");
  Shelly.call("Switch.set", {'id': 0, 'on': false});
  Shelly.call("Switch.set", {'id': 1, 'on': true});
}

/*
 * Timer Vorwärts
 */
function timerVorwaerts() {
  print("Timer Vorwaerts: ", CONFIG.vorwaerts," ms");
  timerVorwaertsTimer = Timer.set(CONFIG.vorwaerts, false, timerVorwaertsPause, null);
  vorwaerts();
};

/*
 * Timer Vorwärts Pause
 */
function timerVorwaertsPause() {
  print("Timer Vorwaerts Pause: ", CONFIG.pause," ms");
  timerVorwaertsPauseTimer = Timer.set(CONFIG.pause, false, timerRueckwaerts, null);
  aus();
};

/*
 * Timer Rückwärts
 */
function timerRueckwaerts() {
  print("Timer Rueckwaerts: ", CONFIG.rueckwaerts," ms");
  timerRueckwaertsTimer = Timer.set(CONFIG.rueckwaerts, false, timerRueckwaertsPause, null);
  rueckwaerts();
};

/*
 * Timer Rückwärts Pause
 */
function timerRueckwaertsPause() {
  print("Timer Rueckwaerts Pause: ", CONFIG.pause," ms");
  timerRueckwaertsPauseTimer = Timer.set(CONFIG.pause, false, timerVorwaerts, null);
  aus();
};



function stop() {
  print("STOP");
  Timer.clear(timerVorwaertsTimer);
  Timer.clear(timerVorwaertsPauseTimer);
  Timer.clear(timerRueckwaertsTimer);
  Timer.clear(timerRueckwaertsPauseTimer);
  aus();
}


/*
 * eventHandler
 */
function eventHandler(event, ud) {
  if (event.info.event === "single_push") {
    if (event.component === "input:0") { //START
      stop(); //Stop before, if somebody did press stop 2 times. 
      print("START");
      timerVorwaerts();
    }
    if (event.component === "input:1") { //STOP
      stop();
    }
  }
}


/*
 * Hauptprogramm
 */
print(greeting);
Shelly.addEventHandler(eventHandler, null);

/*
 * ENDE
 */


