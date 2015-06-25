///<reference path="../../typings/project.d.ts" />

export function RegisterWith(module: ng.IModule) {
  module.directive('dropdownToggle', dropdownToggleFix);
}

function dropdownToggleFix() {
  return {
    restrict: 'A',
    link: function(scope: ng.IScope, elem: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
      elem.on('click', (event) => {
        event.stopPropagation();
      })
    }
  };
}
