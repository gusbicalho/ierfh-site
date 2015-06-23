/// <reference path="../node/node.d.ts" />

declare module 'strip-bom' {
  export = stripBom;
  function stripBom(s: string): string;
  module stripBom {
    export function stream(): NodeJS.ReadWriteStream;
  }
}
