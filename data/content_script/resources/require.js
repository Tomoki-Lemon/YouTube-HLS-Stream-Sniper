window.exports = {};

window.module = {
  "exports": {}
};

(async () => {
  await import("./vendor/formats.js");
  window.formats = Object.assign({}, window.module.exports);
  
  await import("./vendor/utils.js");
  window.utils = Object.assign({}, window.exports);

  await import("./vendor/sig.js");
  window.sig = Object.assign({}, window.exports);
  
  await import("./vendor/info-extras.js");
  window.extras = Object.assign({}, window.exports);
  
  await import("./vendor/format-utils.js");
  window.formatUtils = Object.assign({}, window.exports);

  await import("./vendor/url-utils.js");
  window.urlUtils = Object.assign({}, window.exports);
  
  await import("./vendor/info.js");
  window.info = Object.assign({}, window.exports);
})();

window.require = name => {
  if (name === "./utils") return window.utils;
  else if (name === "./sig") return window.sig;
  else if (name === "./info") return window.info;
  else if (name === "./formats") return window.formats;
  else if (name === "./info-extras") return window.extras;
  else if (name === "./url-utils") return window.urlUtils;
  else if (name === "./format-utils") return window.formatUtils;
  else if (name === "html-entities") {
    return {
      "AllHtmlEntities": {
        decode(str) {
          const parser = new DOMParser();
          const dom = parser.parseFromString(str, "text/html");
          return dom.body.textContent;
        }
      }
    };
  } else if (name === "querystring") {
    return {
      parse(body) {
        const r = {};
        for (const [key, value] of new URLSearchParams(body)) {
          try {
            r[key] = decodeURIComponent(value);
          } catch (e) {
            r[key] = value;
          }
        }
        /*  */
        return r;
      }
    };
  } else if (name === "miniget") {
    const r = (href, o = {}) => ({
      text() {
        var headers = new Headers();
        var request = new Request(href);
        /*  */
        headers.append("Cache", "no-store");
        headers.append("Cache-Control", "no-store");
        /*  */
        for (var id in o.headers) {
          headers.append(id, o.headers[id]);
        }
        /*  */
        return fetch(request, {
          "method": "GET",
          "headers": headers
        }).then(r => r.text());
      }
    });
    /*  */
    return r;
  } else if (name === "sax") {
    const o = {
      close() {},
      write(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/xml");
        [...doc.querySelectorAll('*')].forEach(node => {
          o.onopentag({
            node,
            name: node.tagName.toUpperCase(),
            attributes: [...node.attributes].reduce((p, c) => {
              p[c.name.toUpperCase()] = c.value;
              return p;
            }, {})
          });
        });
        o.onend();
      }
    };
    return {
      parser() {
        return o;
      }
    };
  } else if (name === "url") {
    return {
      resolve(href, pathname) {
        if (pathname.startsWith('http')) {
          return pathname;
        }
        /*  */
        return (new URL(href)).origin + pathname;
      },
      format(o) {
        return (o.protocol + "://").replace("::", ':') + o.host + o.pathname + '?' + Object.entries(o.query).map(([key, value]) => {
          if (value !== undefined) {
            return `${key}=${encodeURIComponent(value)}`;
          }
          /*  */
          return key;
        }).join('&');
      },
      parse(href) {
        const u = new URL(href);
        u.query = {};
        for (const [key, value] of u.searchParams) {
          try {
            u.query[key] = decodeURIComponent(value);
          }
          catch (e) {
            u.query[key] = value;
          }
        }
        /*  */
        return u;
      }
    };
  } else if (name === "./cache") {
    window.Cache = class Cache extends Map {
      constructor(timeout = 1000) {
        super();
        this.timeout = timeout;
      }
      /*  */
      set(key, value) {
        super.set(key, {"tid": setTimeout(this.delete.bind(this, key), this.timeout), value});
      }
      /*  */
      clear() {
        for (let entry of this.values()) clearTimeout(entry.tid);
        super.clear();
      }
      /*  */
      delete(key) {
        let entry = super.get(key);
        if (entry) {
          clearTimeout(entry.tid);
          super.delete(key);
        }
      }
      /*  */
      get(key) {
        let entry = super.get(key);
        if (entry) {
          return entry.value;
        }
        /*  */
        return null;
      }
      /*  */
      async getOrSet(key, fn) {
        if (this.has(key)) {
          return this.get(key);
        } else {
          let value = await fn();
          this.set(key, value);
          return value;
        }
      }
    };
    /*  */
    return window.Cache;
  }
  /*  */
  return {};
};
