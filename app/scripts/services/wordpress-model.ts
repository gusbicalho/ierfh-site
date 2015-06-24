///<reference path="../../../typings/project.d.ts" />

export function RegisterWith(module: ng.IModule) {
  module.service('WordpressModel', Service);
}

export class Service {
  constructor(private Restangular: restangular.IService) {
    this.Restangular = Restangular.withConfig((provider) => {
      provider.setBaseUrl('/ierfh/wp-json');
      provider.setParentless([]);
      provider.setDefaultHttpFields({cache: true});
    });
  }
  
  index() {
    return this.Restangular.one('');
  }
  getIndex() {
    return this.index().get<Index>();
  }
  
  posts() {
    return this.Restangular.all('posts');
  }
  getPosts(queryParams?: any) {
    return this.posts().getList<Post>(queryParams);
  }
  post(id: number) {
    return  this.Restangular.one('posts', id);
  }
  getPost(id: number): ng.IPromise<Post>;
  getPost(slug: string): ng.IPromise<Post>;
  getPost(post: number | string): ng.IPromise<Post> {
    if (typeof post === 'number')
      return this.post(post).get<Post>();
    else
      return this.Restangular.all('posts').getList<Post>({
        'filter[name]': post
      }).then((posts) => posts[0])
  }

  taxonomies() {
    return this.Restangular.all('taxonomies');
  }
  getTaxonomies(queryParams?: any) {
    return this.taxonomies().getList<Taxonomy>(queryParams);
  }
  taxonomy(name: string) {
    return this.Restangular.one('taxonomies', name);
  }
  taxonomyAccessor(name: string) {
    return new TaxonomyAccessor(this.taxonomy(name));
  }
  
  categories() {
    return this.taxonomy('category');
  }
  categoriesAccessor() {
    return this.taxonomyAccessor('category');
  }

  tags() {
    return this.taxonomy('post_tags');
  }
  tagsAccessor() {
    return this.taxonomyAccessor('post_tags');
  }

}

export class TaxonomyAccessor {
  constructor(private taxonomy: restangular.IElement) {}

  element() {
    return this.taxonomy;
  }
  get() {
    return this.taxonomy.get<Taxonomy>();
  }
  
  terms() {
    return this.taxonomy.all('terms');
  }
  getTerms(queryParams?: any) {
    return this.terms().getList<TaxonomyTerm>(queryParams);
  }
  term(id: number) {
    return this.taxonomy.one('terms', id);
  }
  getTerm(id: number): ng.IPromise<TaxonomyTerm>;
  getTerm(slug: string): ng.IPromise<TaxonomyTerm>;
  getTerm(term: number | string) {
    if (typeof term === 'number') {
      return this.term(term).get<TaxonomyTerm>();
    } else {
      return this.taxonomy.all('terms').getList<TaxonomyTerm>({
        'filter[slug]': term
      }).then((terms) => terms[0]);
    }
  }

}

export interface RouteDescriptor {
  /**
   * A JSON array of supported HTTP methods (verbs).
   * 
   * Possible values are “HEAD”, “GET”, “POST”, “PUT”, “PATCH”, “DELETE”
   */
  supports: string[];
  /**
   * A boolean indicating whether data can be passed directly via a POST request body.
   * 
   * Default for missing properties is false.
   */
  accepts_json: boolean;
  /**
   * An Entity Meta entity.
   * 
   * Typical links values consist of a self link pointing to the route’s full URL.
   */
  meta: Meta;
}

export interface Index {
  /**
   * String with the site’s name.
   */
  name: string;
  /**
   * String with the site’s description.
   */
  description: string;
  /**
   * String with the URL to the site itself.
   */
  url: string;
  /**
   * The routes field is an object with keys as a route and the values as a RouteDescriptor.
   * 
   * The route is a string giving the URL template for the route, relative to the API root. The template
   * contains URL parts separated by forward slashes, with each URL part either a static string, or a
   * route variable encased in angle brackets.
   * 
   * These routes can be converted into URLs by replacing all route variables with their relevant values,
   * then concatenating the relative URL to the API base.
   */
  routes: {
    [route: string]: RouteDescriptor
  };
  /**
   * An Entity Meta entity.
   * 
   * Typical links values for the meta object consist of a help key with the value indicating a human-readable
   * documentation page about the API.
   */
  meta: Meta;
}
export interface Post {
  /**
   * Post's ID.
   */
  ID: number;
  /**
   * String with the post’s slug.
   */
  slug: string;
  /**
   * User who created the post.
   */
  author: User;
  /**
   * String with the post’s title.
   */
  title: string;
  /**
   * String with the post’s creation date and time in the local time, following the <a href="http://tools.ietf.org/html/rfc3339#section-5.6">RFC3339 Section 5.6</a> datetime representation.
   */
  date: string;
  /**
   * String with the post’s creation date and time in UTC time, following the <a href="http://tools.ietf.org/html/rfc3339#section-5.6">RFC3339 Section 5.6</a> datetime representation.
   */
  date_gmt: string;
  /**
   * String with the post’s last modification date and time in the local time, following the <a href="http://tools.ietf.org/html/rfc3339#section-5.6">RFC3339 Section 5.6</a> datetime representation.
   */
  modified: string;
  /**
   * String with the post’s last modification date and time in UTC time, following the <a href="http://tools.ietf.org/html/rfc3339#section-5.6">RFC3339 Section 5.6</a> datetime representation.
   */
  modified_gmt: string;
  date_tz: string;
  modified_tz: string;
  /**
   * String with the post’s content.
   */
  content: string;
  /**
   * String with the post’s excerpt.
   * 
   * This is usually a shortened version of the post content, suitable for displaying in collection views.
   */
  excerpt: string;
  content_raw?: string;
  excerpt_raw?: string;
  /**
   * JSON object or integer with the post’s parent post ID. A literal zero indicates that the post does not have a parent post.
   * 
   * Consumers who encounter a missing parent ID MUST treat it the same as a parent post ID of 0.
   * 
   * Parent fields will be expanded into a full Post entity in the view or edit contexts, but only one level deep.
   * The embedded Post entity will be rendered using the parent context. In the parent context, the field will contain
   * an integer with the post’s parent post ID as above.
   */
  parent: Post | string | number;
  /**
   * String with the full URL to the post’s canonical view. 
   */
  link: string;
  /**
   * String with the post’s status.
   * 
   * This status relates to where the post is in the editorial process. These are usually set values,
   * but some providers may have extra post statuses.
   * 
   * status = "draft" / "pending" / "private" / "publish" / "trash" / token
   * 
   * Consumers who encounter an unknown or missing post status SHOULD treat it the same as a “draft” status.
   */
  status: string;
  /**
   * String with the post’s type.
   * 
   * This field is specific to providers, with the most basic representation being “post”. The type of the
   * post usually relates to the fields in the Post entity, with other types having additional fields specific
   * to the type.
   */
  type: string;
  /**
   * String with the post’s password.
   * 
   * A zero-length password indicates that the post does not have a password.
   */
  password: string;
  /**
   * The guid field is a string with the post’s globally unique identifier (GUID).
   * 
   * The GUID is typically in URL form, as this is a relatively easy way of ensuring that the GUID is globally unique.
   * However, consumers MUST NOT treat the GUID as a URL, and MUST treat the GUID as a string of arbitrary characters.
   */
  guid: string;
  menu_order: number;
  /**
   * The comment_status field is a string with the post’s current commenting status.
   * 
   * This field indicates whether users can submit comments to the post.
   * 
   * post-comment-status = "open" / "closed" / token
   * 
   * Providers MAY use statuses other than “open” or “closed” to indicate other statuses.
   * Consumers who encounter an unknown or missing comment status SHOULD treat it as “closed”.
   */
  comment_status: string;
  /**
   * The comment_status field is a string with the post’s current pingback/trackback status.
   * 
   * This field indicates whether users can submit pingbacks or trackbacks to the post.
   * 
   * post-comment-status = "open" / "closed" / token
   * 
   * Providers MAY use statuses other than “open” or “closed” to indicate other statuses.
   * Consumers who encounter an unknown or missing comment status SHOULD treat it as “closed”.
   */
  ping_status: string;
  /**
   * Boolean indicating whether the post is marked as a sticky post
   */
  sticky: boolean;
  post_thumbnail: Media;
  /**
   * The post_format field is a string with the post format.
   * 
   * The post format indicates how some meta fields should be displayed. For example, posts with the “link”
   * format may wish to display an extra link to a URL specified in a meta field or emphasise a link in the post content.
   * 
   * post-format = "standard" / "aside" / "gallery" / "image" / "link" / "status" / "quote" / "video" / "audio" / "chat"
   * 
   * Providers MUST NOT use post formats not specified by this specification, unless specified in a subsequent version of
   * the specification. Consumers MUST treat unknown post formats as “standard”.
   */
  post_format: string;
  terms: TaxonomyTerm[];
  post_meta: Metadata;
  meta: Meta;
}
export interface Meta {
  links: {
    [relation: string]: string;
  }
}
export interface User {
  ID: number;
  name: string;
  slug: string;
  /**
   * String with the URL to the author’s site.
   * 
   * This is typically an external link of the author’s choice.
   */
  url: string;
  /**
   * String with the URL to the author’s avatar image.
   * 
   * Providers SHOULD ensure that for users without an avatar image, this field is either zero-length or the URL
   * returns a HTTP 404 error code on access.
   * Consumers MAY display a default avatar instead of a zero-length or URL which returns a HTTP 404 error code.
   */
  avatar: string;
  meta: Meta;
}
export interface AnonymousUser {
  /**
   * The ID property is always set to 0 for anonymous authors.
   */
  ID: number;
  name: string;
  /**
   * String with the URL to the author’s site.
   * 
   * This is typically an external link of the author’s choice.
   */
  url: string;
  /**
   * String with the URL to the author’s avatar image.
   * 
   * Providers SHOULD ensure that for users without an avatar image, this field is either zero-length or the URL
   * returns a HTTP 404 error code on access.
   * Consumers MAY display a default avatar instead of a zero-length or URL which returns a HTTP 404 error code.
   */
  avatar: string;
}
/**
 * 
 */
export interface MetadataField {
  id: number;
  key: string;
  value: string;
}
export interface Metadata extends Array<MetadataField> {}

export interface Comment {
  ID: number;
  content: string;
  /**
   * String with the comment’s status.
   * 
   * This field indicates whether the comment is in the publishing process, or if it has been deleted or marked as spam.
   * 
   * comment-status = "hold" / "approved" / "spam" / "trash" / token
   * 
   * Providers MAY use other values to indicate other statuses. Consumers who encounter an unknown or missing status
   * SHOULD treat it as “hold”.
   */
  status: string;
  /**
   * String with the comment’s type.
   * 
   * This is usually one of the following, but providers may provide additional values.
   * 
   * comment-type = "comment" / "trackback" / "pingback" / token
   * 
   * Providers MAY use other values to indicate other types. Consumers who encounter an unknown or missing status
   * SHOULD treat it as “comment”.
   */
  type: string;
  /**
   * Integer with the ID of the parent post for the comment, or a Post entity describing the parent post.
   * 
   * A literal zero indicates that the comment does not have a parent post.
   * Consumers who encounter a missing post ID MUST treat it the same as a parent post ID of 0.
   */
  post: Post | number | string;
  /**
   * Integer with the ID of the parent comment, or a Comment entity describing the parent comment.
   * 
   * A literal zero indicates that the comment does not have a parent comment.
   * Consumers who encounter a missing parent ID MUST treat it the same as a parent comment ID of 0.
   */
  parent: Comment | number | string;
  /**
   * String with the post’s creation date and time in the local time, following the <a href="http://tools.ietf.org/html/rfc3339#section-5.6">RFC3339 Section 5.6</a> datetime representation.
   */
  date: string;
  /**
   * String with the post’s creation date and time in UTC time, following the <a href="http://tools.ietf.org/html/rfc3339#section-5.6">RFC3339 Section 5.6</a> datetime representation.
   */
  date_gmt: string;
  /**
   * String with the post’s last modification date and time in the local time, following the <a href="http://tools.ietf.org/html/rfc3339#section-5.6">RFC3339 Section 5.6</a> datetime representation.
   */
  modified: string;
  /**
   * String with the post’s last modification date and time in UTC time, following the <a href="http://tools.ietf.org/html/rfc3339#section-5.6">RFC3339 Section 5.6</a> datetime representation.
   */
  modified_gmt: string;
  date_tz: string;
  modified_tz: string;
  /**
   * User entity with the comment author’s data, or a User-like object for anonymous authors.
   */
  author: User | AnonymousUser;
}
export interface Media extends Post {
  /**
   * String with the URL of the entity’s original file.
   * 
   * For image media, this is the source file that intermediate representations are generated from.
   * For non-image media, this is the attached media file itself.
   */
  source: string;
  is_image: boolean;
  /**
   * MediaMeta object related to the image.
   * 
   * If the file is not an image (as indicated by the is_image field), this is an empty JSON object.
   */
  attachment_meta: MediaMeta;
}
export interface SizeMapping {
  /**
   * The full URL to the intermediate file.
   */
  url: string;
  /**
   * The filename of the intermediate file, relative to the directory of the original file.
   */
  file: string;
  width: number;
  height: number;
  'mime-type': string;
}
export interface MediaMeta {
  width: number;
  height: number;
  /**
   * String with the path to the original file, relative to the site’s upload directory.
   */
  file: string;
  /**
   * Object mapping intermediate image sizes to image data objects.
   * 
   * The key of each item is the size of the intermediate image as an internal string representation.
   */
  sizes: {
    [size: string]: SizeMapping
  };
  image_meta: {
    aperture?: string;
    credit?: string;
    camera?: string;
    created_timestamp?: number;
    copyright?: string;
    focal_length?: string;
    iso?: string;
    shutter_speed?: string;
    title?: string;
    [key: string]: any;
  }
}
export interface PostType {
  name: string;
  slug: string;
  description: string;
  queryable: boolean;
  searchable: boolean;
  hierarchical: boolean;
  meta: Meta;
  labels: {
    [key: string]: string;
  };
}
export interface Taxonomy {
  name: string;
  slug: string;
  show_cloud: boolean;
  hierarchical: boolean;
  meta: Meta;
  labels: {
    [key: string]: string;
  };
  types: {
    [type: string]: PostType;
  }
}
export interface TaxonomyTerm {
  ID: number;
  name: string;
  slug: string;
  description: string;
  taxonomy: string;
  parent: TaxonomyTerm | number | string;
}
