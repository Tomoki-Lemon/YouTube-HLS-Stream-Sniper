app.addon.receive("page:get-video-size", function (e) {
  config.size(e.url, function (size) {
    if (size && size.length) {
      app.addon.send("page:set-video-size", {
        "size": size
      }, (e ? e.tabId : null));
    }
  });
});

app.addon.receive("options:load", function () {
  app.addon.send("options:storage", {
    "a": config.show['a'],
    "v": config.show['v'],
    "flv": config.format["flv"],
    "mp4": config.format["mp4"],
    "3gp": config.format["3gp"],
    "m4a": config.format["m4a"],
    "webm": config.format["webm"],
    "support": config.welcome.open,
    "saveAs": config.download.saveAs
  });
});

app.addon.receive("page:download", config.download.start);
app.addon.receive("page:conver-to-mp3", function () {app.tab.open(config.page.convert)});

app.addon.receive("options:store-a", function (e) {config.show["a"] = e["a"]});
app.addon.receive("options:store-v", function (e) {config.show["v"] = e["v"]});
app.addon.receive("options:store-flv", function (e) {config.format["flv"] = e["flv"]});
app.addon.receive("options:store-mp4", function (e) {config.format["mp4"] = e["mp4"]});
app.addon.receive("options:store-3gp", function (e) {config.format["3gp"] = e["3gp"]});
app.addon.receive("options:store-m4a", function (e) {config.format["m4a"] = e["m4a"]});
app.addon.receive("options:save-as", function (e) {config.download.saveAs = e["saveAs"]});
app.addon.receive("options:store-webm", function (e) {config.format["webm"] = e["webm"]});
app.addon.receive("options:store-support", function (e) {config.welcome.open = e.support});
