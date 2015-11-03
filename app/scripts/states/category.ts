///<reference path="../../../typings/project.d.ts" />

import fs = require('fs');
import stripBom = require('strip-bom');
import WordpressModel = require('../services/wordpress-model');

export function RegisterWith(module: ng.IModule) {
  module.config(configStates);
}

function configStates($stateProvider: ng.ui.IStateProvider) {
  $stateProvider
    .state('category', {
      url: '/cat/:catSlug',
      resolve: {
        catSlug: ($stateParams: ng.ui.IStateParamsService) => $stateParams['catSlug'],
        category:
          (WordpressModel: WordpressModel.Service, catSlug: string) =>
            WordpressModel.categoriesAccessor().getTerm(catSlug),
      },
      data: {},
      views: {
        '': {
          template: stripBom(fs.readFileSync(__dirname+'/category.html','utf-8')),
          controller: Controller,
          controllerAs: 'ctrl'
        },
        'header': {
          template: stripBom(fs.readFileSync(__dirname+'/category-header.html','utf-8')),
          controller: Controller,
          controllerAs: 'ctrl'
        },
      }
    })
    ;
}

export class Controller {
  // @ngInject
  constructor(private catSlug: string,
              public category: WordpressModel.TaxonomyTerm,
              private WordpressModel: WordpressModel.Service,
              $state: ng.ui.IStateService) {
    $state.current.data.bodyClasses = ['cat-'+catSlug];
    var catParent = category.parent;
    if (catParent && typeof catParent !== 'number' && typeof catParent !== 'string')
      $state.current.data.bodyClasses.push('cat-'+catParent.slug);
    WordpressModel.getPosts({
      'filter[cat]': category.ID,
      'filter[posts_per_page]': 10
    }).then((posts) => this.posts = this.posts.concat(posts));
  }
  posts: WordpressModel.Post[] = [];
}

class HeaderController {
  // @ngInject
  constructor(private catSlug: string,
              public category: WordpressModel.TaxonomyTerm){}  
}
