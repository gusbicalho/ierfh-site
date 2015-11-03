///<reference path="../../../../typings/project.d.ts" />

import fs = require('fs');
import stripBom = require('strip-bom');
import WordpressModel = require('../../services/wordpress-model');

export function RegisterWith(module: ng.IModule) {
  module.directive('floatingCategoryList', DirectiveFactory);
}

export function DirectiveFactory(): ng.IDirective {
  return new Directive();
}

export class Directive implements ng.IDirective {
  restrict = 'AE';
  scope = {
  };
  template = stripBom(fs.readFileSync(__dirname+'/template.html','utf-8'));
  controller = Controller;
  controllerAs = 'ctrl';
}

export class Controller {
  // @ngInject
  constructor(private WordpressModel: WordpressModel.Service) {
      WordpressModel.categoriesAccessor().getTerms()
        .then((terms) => this.categories =
                            _(terms).filter((t) => t.ID !== 1 && (!t.parent || t.parent === '0'))
                                    .sortBy((term) => term.slug)
                                    .value())
  }
  categories: WordpressModel.TaxonomyTerm[];
}