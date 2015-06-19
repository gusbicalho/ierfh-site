///<reference path="../../typings/project.d.ts" />

import angular = require('angular');
import ngMessages = require('angular-messages');
import ngUiRouter = require('angular-ui-router');

export = 'example.App';

var app = angular.module('example.App',
                         [ngMessages, ngUiRouter]);

import App = require('./app');
import StateLanding = require('./states/landing');

App.RegisterWith(app);
StateLanding.RegisterWith(app);
