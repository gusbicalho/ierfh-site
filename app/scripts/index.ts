///<reference path="../../typings/project.d.ts" />

import Spinner = require('spin.js');
window['Spinner'] = Spinner; // For compatibility with angularSpinner

import angular = require('angular');
import ngMessages = require('angular-messages');
import ngSanitize = require('angular-sanitize');
import ngUiRouter = require('angular-ui-router');
import ngSpinner = require('angular-spinner');

export = 'example.App';

var app = angular.module('example.App',
                         [ngSanitize, ngMessages, ngUiRouter, 'ui.bootstrap',
                           (ngSpinner, 'angularSpinner')]);

import App = require('./app');
import StateLanding = require('./states/landing');
import StatePost = require('./states/post');

App.RegisterWith(app);
StateLanding.RegisterWith(app);
StatePost.RegisterWith(app);
