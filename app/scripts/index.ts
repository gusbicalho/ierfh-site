///<reference path="../../typings/project.d.ts" />

import _ = require('lodash');
window['_'] = _; // For compatibility with Restangular
import Spinner = require('spin.js');
window['Spinner'] = Spinner; // For compatibility with angularSpinner

import angular = require('angular');
import ngMessages = require('angular-messages');
import ngSanitize = require('angular-sanitize');
import ngAnimate = require('angular-animate');
import ngUiRouter = require('angular-ui-router');
import angularSpinner = require('angular-spinner');
import restangular = require('restangular');

export = 'example.App';

var app = angular.module('example.App',
                         [ngSanitize, ngAnimate, ngMessages, ngUiRouter, 'ui.bootstrap',
                           (angularSpinner, 'angularSpinner'), (restangular, 'restangular')]);

import App = require('./app');
import WordpressModel = require('./services/wordpress-model');
import StateLanding = require('./states/landing');
import StatePost = require('./states/post');

App.RegisterWith(app);
WordpressModel.RegisterWith(app);
StateLanding.RegisterWith(app);
StatePost.RegisterWith(app);
