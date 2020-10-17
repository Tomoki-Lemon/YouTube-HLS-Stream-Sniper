var config = {};

config.cache = {};
config.storage = {"url": '', "tokens": []};
config.page = {"convert": "https://webbrowsertools.com/convert-to-mp3/"};

config.welcome = {
  set open (val) {app.storage.write("support", val)},
  set lastupdate (val) {app.storage.write("lastupdate", val)},
  get open () {return (app.storage.read("support") !== undefined) ? app.storage.read("support") : true},
  get lastupdate () {return app.storage.read("lastupdate") !== undefined ? app.storage.read("lastupdate") : 0}
};

config.show = {
  set "v" (val) {app.storage.write("video-only", val)},
  set "a" (val) {app.storage.write("audio-only", val)},
  get "v" () {return (app.storage.read("video-only") !== undefined) ? app.storage.read("video-only") : true},
  get "a" () {return (app.storage.read("audio-only") !== undefined) ? app.storage.read("audio-only") : true}
};

config.download = {
  set "saveAs" (val) {app.storage.write("save-as", val)},
  get "saveAs" () {return (app.storage.read("save-as") !== undefined) ? app.storage.read("save-as") : false},
  "start": function (o) {
    var firefox = navigator.userAgent.indexOf("Firefox") === -1;
    var tmp = firefox ? {"url": o.url, "filename": o.filename, "saveAs": config.download.saveAs} : {"url": o.url, "filename": o.filename};
    chrome.downloads.download(tmp, function () {});
  }
};

config.format = {
  set "flv" (val) {app.storage.write("flv", val)},
  set "mp4" (val) {app.storage.write("mp4", val)},
  set "3gp" (val) {app.storage.write("3gp", val)},
  set "m4a" (val) {app.storage.write("m4a", val)},
  set "webm" (val) {app.storage.write("webm", val)},
  get "flv" () {return (app.storage.read("flv") !== undefined) ? app.storage.read("flv") : true},
  get "mp4" () {return (app.storage.read("mp4") !== undefined) ? app.storage.read("mp4") : true},
  get "3gp" () {return (app.storage.read("3gp") !== undefined) ? app.storage.read("3gp") : true},
  get "m4a" () {return (app.storage.read("m4a") !== undefined) ? app.storage.read("m4a") : true},
  get "webm" () {return (app.storage.read("webm") !== undefined) ? app.storage.read("webm") : true}
};

config.size = function (url, callback) {
  if (config.cache[url]) {
    callback([url, config.cache[url]]);
  } else {
    var httprequest = new XMLHttpRequest();
    /*  */
    httprequest._url = url;
    httprequest.onerror = function (r) {
      callback([r.target._url, 0]);
    };
    /*  */
    httprequest.onreadystatechange = function (r) {      
      if (httprequest.readyState === 4) {
        if (httprequest.status === 200) {
          var length = null;
          try {
            length = httprequest.getResponseHeader("Content-Length");
          } catch (e) {
            callback([r.target._url, 0]);
          }
          /*  */
          if (length) {
            config.cache[r.target._url] = length;
            callback([r.target._url, length]);
          } else callback([r.target._url, 0]);
        } else {
          callback([r.target._url, 0]);
        }
      }
    }
    /*  */
    try {
      httprequest.open("HEAD", url, true);
      httprequest.setRequestHeader("Cache-Control", "no-cache");
      httprequest.send(null);
    } catch (e) {
      callback([url, 0]);
    }
  }
};

config.get = function (name) {return name.split('.').reduce(function (p, c) {return p[c]}, config)};

config.set = function (name, value) {
  function set (name, value, scope) {
    name = name.split('.');
    if (name.length > 1) set.call((scope || this)[name.shift()], name.join('.'), value);
    else this[name[0]] = value;
  }
  set (name, value, config);
};
