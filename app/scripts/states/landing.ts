///<reference path="../../../typings/project.d.ts" />

import fs = require('fs');
import stripBom = require('strip-bom');
import WordpressModel = require('../services/wordpress-model');

export function RegisterWith(module: ng.IModule) {
  module.config(configStates);
}

function configStates($stateProvider: ng.ui.IStateProvider) {
  $stateProvider
    .state('landing', {
      url: '/',
      template: stripBom(fs.readFileSync(__dirname+'/landing.html','utf-8')),
      controller: LandingController,
      controllerAs: 'ctrl'
    })
    ;
}

export class LandingController {
  // @ngInject
  constructor(private WordpressModel: WordpressModel.Service) {
    WordpressModel.getPosts().then((posts) => this.posts = posts);
  }
  posts: WordpressModel.Post[];
}
