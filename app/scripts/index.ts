///<reference path="../../typings/project.d.ts" />

import angular = require('angular');
import ngMessages = require('angular-messages');
import ngSanitize = require('angular-sanitize');
import ngUiRouter = require('angular-ui-router');
import ngSpinner = require('angular-spinner');

export = 'example.App';

var app = angular.module('example.App',
                         [ngSanitize, ngMessages, ngUiRouter, 'ui.bootstrap',
                           (ngSpinner, 'angularSpinner')]);

import Spinner = require('spin.js');
app.run(($window: ng.IWindowService) => {
  $window['Spinner'] = Spinner;
});

import App = require('./app');
import StateLanding = require('./states/landing');
import StateAnother = require('./states/another');

App.RegisterWith(app);
StateLanding.RegisterWith(app);
StateAnother.RegisterWith(app);
