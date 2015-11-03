///<reference path="../../../typings/project.d.ts" />

import _ = require('lodash');
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
      resolve: {
        topCategories:
          (WordpressModel: WordpressModel.Service) =>
            WordpressModel.categoriesAccessor().getTerms()
              .then((terms) => _(terms).filter((t) => t.ID !== 1 && (!t.parent || t.parent === '0'))
                                       .sortBy((term) => term.slug)
                                       .value())
      },
      data: {
        bodyClasses: ['landing']
      },
      views: {
        '': {template: ''},
        'header': {
          template: stripBom(fs.readFileSync(__dirname+'/landing-header.html','utf-8')),
          controller: LandingController,
          controllerAs: 'ctrl'
        }
      }
    })
    ;
}

export class LandingController {
  // @ngInject
  constructor(public topCategories: WordpressModel.TaxonomyTerm[],
              private WordpressModel: WordpressModel.Service) {
    WordpressModel.getPosts().then((posts) => this.posts = posts);
  }
  posts: WordpressModel.Post[];
  indexClass(classPrefix: string, index: number | string, last?: boolean) {
    var classes: any = {};
    classes[classPrefix+index] = true;
    if (last)
      classes[classPrefix+'last'] = true;
    return classes;
  }
}
