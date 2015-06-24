///<reference path="../../../typings/project.d.ts" />

export function RegisterWith(module: ng.IModule) {
  module.service('WordpressModel', Service);
}

export interface Post {
  id: number;
  slug: string;
  title: string;
}

export class Service {
  constructor(private Restangular: restangular.IService) {
    this.Restangular = Restangular.withConfig((provider) => {
      provider.setBaseUrl('/ierfh/wp-json');
      provider.setParentless([]);
      provider.setDefaultHttpFields({cache: true});
    });
  }
  
  posts() {
    return this.Restangular.all('posts').getList<Post>();
  }
  post(id: number | string) {
    if (typeof id === 'number')
      return this.Restangular.one('posts', id).get<Post>();
    else
      return this.Restangular.all('posts').getList<Post>({
        'filter[name]': id
      }).then((posts) => posts[0])
  }
}
