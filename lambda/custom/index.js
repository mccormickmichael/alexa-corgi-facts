/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'Corgi Facts';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a corgi fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/lambda/data
//=========================================================================================================================================

const data = [
  "Corgis are the eleventh smartest dog breed.",
  "Queen Elizabeth has five corgis named Monty, Emma, Linnet, Willow, and Holly.",
  "Corgis are one foot tall at the shoulder.",
  "Corgis have been bred to be nearly tailless.",
  "Corgis can sploot.",
  "The name 'corgi' means 'dwarf dog' in Welsh.",
  "Legend says that fairies used to ride corgis into battle.",
  "Corgis come in six colors: Fawn, Blue, Red, Sable, Black and Tan, and Black and White"
];

var frequencies = data.map( x => 0);

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetNewFactIntent');
    },
    'GetNewFactIntent': function () {
        var factIndex = 0;
        var highest = 0;
        var invTotal = 0;
        for (var i = 0; i < frequencies.length; i++){
          if (frequencies[i] > highest){
            highest = frequencies[i];
          }
        }
        var invFrequencies = frequencies.map(x => highest - x + 1);
        for (var i = 0; i < invFrequencies.length; i++){
          invTotal += invFrequencies[i];
        }
        var rand = Math.floor(Math.random() * invTotal);
        for (var i = 0; i < frequencies.length; i++){
          rand -= invFrequencies[i];
          if (rand <= 0){
            factIndex = i;
            break
          }
        }
        frequencies[factIndex]++;
        const factArr = data;
        const randomFact = factArr[factIndex];
        const speechOutput = GET_FACT_MESSAGE + randomFact;

        this.response.cardRenderer(SKILL_NAME, randomFact);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};
