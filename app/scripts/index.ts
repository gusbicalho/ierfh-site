///<reference path="../../typings/project.d.ts" />

import angular = require('angular');
import ngMessages = require('angular-messages');
import ngUiRouter = require('angular-ui-router');

export = 'example.App';

var app = angular.module('example.App',
                         [ngMessages, ngUiRouter, 'ui.bootstrap']);

import App = require('./app');
import StateLanding = require('./states/landing');
import StateAnother = require('./states/another');

App.RegisterWith(app);
StateLanding.RegisterWith(app);
StateAnother.RegisterWith(app);
