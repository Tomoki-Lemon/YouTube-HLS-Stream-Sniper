var page = {
  "root": "data/content_script/",
  "interval": {"action": null, "button": null},
  "format": {
    "size": function (s) {
      if (s >= Math.pow(2, 30)) return (s / Math.pow(2, 30)).toFixed(1) + "GB";
      if (s >= Math.pow(2, 20)) return (s / Math.pow(2, 20)).toFixed(1) + "MB";
      if (s >= Math.pow(2, 10)) return (s / Math.pow(2, 10)).toFixed(1) + "KB";
      return s + "B";
    }
  },
  "download": {
    "ul": {"id": "ydl-page-ul-id"},
    "icon": {"id": "ydl-page-icon-id"},
    "button": {"id": "ydl-page-button-id"},
    "url": function () {
      var icon = document.getElementById(page.download.icon.id);
      if (icon) {
        background.send("page:catch-download-url", {"url": document.location.href});
        var url = chrome.runtime.getURL(page.root + "icons/loader.gif");
        icon.style.background = "url(" + url + ") no-repeat center center";
        icon.style.backgroundSize = "16px";
      }
    }
  },
  "action": function () {
    if (page.interval.button) window.clearInterval(page.interval.button);
    var button = document.getElementById(page.download.button.id);
    if (!button) {
      page.interval.button = window.setInterval(function () {
        button = page.button.insert();
        if (button) {
          window.addEventListener("click", page.menu.hide, false);
          if (page.interval.button) window.clearInterval(page.interval.button);
          button.addEventListener("click", function () {page.menu.ul ? page.menu.hide() : page.download.url()}, false);
        }
      }, 300);
    }
  },
  "menu": {
    "ul": null,
    "max": {"width": 450},
    "hide": function () {
      var tmp = document.getElementById(page.download.ul.id);
      if (tmp) tmp.parentNode.removeChild(tmp);
      page.menu.ul = null;
    },
    "show": function (title, downloadlist) {
      var count = 0;
      downloadlist = downloadlist.reverse();
      page.menu.ul = document.createElement("ul");
      page.menu.ul.setAttribute("id", page.download.ul.id);
      page.menu.ul.setAttribute("class", "ydl-dropdown-material");
      var max = parseInt(window.getComputedStyle(document.body).width);
      title = title.replace(/[`~!@#$%^&*()|+=?;:'",<>{}[\]\\/]/gi, '_').replace(/[\\/:*?"<>|]/g, '_').substring(0, 240);
      /*  */
      var addmenuitem = function (o, i, t) {
        var header = t === "header";
        var segmented = o && (typeof o.url) === "object";
        var mixed = o && t === "mixed" && segmented === false && o.isHLS === false && o.mimeType.startsWith("video/") && o.audioBitrate;
        var audio = o && t === "audio" && segmented === false && o.isHLS === false && o.mimeType.startsWith("audio/") && o.audioBitrate;
        var video = o && t === "video" && segmented === false && o.isHLS === false && o.mimeType.startsWith("video/") && o.audioBitrate === null;
        /*  */
        if (header) {
           var span = {};
           var li = document.createElement("li");
           span.a = document.createElement("span");
           span.b = document.createElement("span");
           var button = document.createElement("button");
           /*  */
           button.setAttribute("type", "button");
           button.setAttribute("class", "ydl-menuitem-material");
           button.setAttribute("data-orientation", "horizontal");
           li.setAttribute("class", "ydl-menuitem-sticky-header");
           /*  */
           span.a.style.padding = "0 5px";
           span.a.style.textAlign = "right";
           span.a.textContent = "▶ Convert to MP3";
           span.a.style.width = max > page.menu.max.width ? "auto" : "auto";
           span.a.title = "Convert local media files (audio & video) to .mp3 format";
           span.a.addEventListener("click", function () {background.send("page:conver-to-mp3", {})});
           /*  */
           span.b.style.display = "none";
           span.b.style.textAlign = "right";
           span.b.style.padding = "0 5px 0 0";
           span.b.textContent = "✕ Clear Cache";
           span.b.style.width = max > page.menu.max.width ? "97px" : "97px";
           span.b.title = "Clear cache if download links are not working or you see any errors";
           span.b.addEventListener("click", function () {
             page.menu.hide();
           });
           /*  */
           button.appendChild(span.a);
           button.appendChild(span.b);
           li.appendChild(button);
           page.menu.ul.appendChild(li);
        } else if (mixed || audio || video) {
          count = count + 1;
          var src = {}, span = {};
          var li = document.createElement("li");
          span.a = document.createElement("span");
          span.b = document.createElement("span");
          span.c = document.createElement("span");
          span.d = document.createElement("span");
          span.e = document.createElement("span");
          var button = document.createElement("button");
          /*  */
          li.setAttribute("role", "menuitem");
          button.setAttribute("_index", i);
          button.setAttribute("type", "button");
          button.setAttribute("class", "ydl-menuitem-material");
          button.setAttribute("data-orientation", "horizontal");
          button.setAttribute("_url", (o.url + "&title=" + title.toLowerCase()));
          button.setAttribute("_filename", (title.toLowerCase() + '.' + o.container));
          button.addEventListener("click", function () {
            background.send("page:download", {
              "url": this.getAttribute("_url"), 
              "filename": this.getAttribute("_filename")
            });
          });
          /*  */
          src.video = "Video " + (mixed || video ? (o.qualityLabel ? o.qualityLabel : "N/A") : "N/A");
          src.audio = "Audio " + (mixed || audio ? (o.audioBitrate ? o.audioBitrate + "kbps" : "N/A") : "N/A");
          /*  */
          span.a.style.width = max > page.menu.max.width ? "24px" : "14px";
          span.b.style.width = max > page.menu.max.width ? "24px" : "18px";
          span.c.style.width = max > page.menu.max.width ? "125px" : "110px";
          span.d.style.width = max > page.menu.max.width ? "125px" : "110px";
          span.e.style.width = max > page.menu.max.width ? "auto" : "auto";
          span.e.setAttribute("ydl-d-u", o.url);
          span.e.style.textAlign = "right";
          /*  */
          span.a.style.color = video ? "rgb(109, 166, 26)" : (audio ? "rgb(66, 130, 198)" : "#555");
          span.b.style.color = video ? "rgb(109, 166, 26)" : (audio ? "rgb(66, 130, 198)" : "#555");
          span.c.style.color = video ? "rgb(109, 166, 26)" : (audio ? "rgb(66, 130, 198)" : "#555");
          span.d.style.color = video ? "rgb(109, 166, 26)" : (audio ? "rgb(66, 130, 198)" : "#555");
          span.e.style.color = video ? "rgb(109, 166, 26)" : (audio ? "rgb(66, 130, 198)" : "#555");
          span.e.style.padding = '0 5px 0 0';
          span.e.style.float = 'right';
          /*  */
          span.a.style.background = "url(" + chrome.runtime.getURL(page.root + "icons/") + (video ? "video" : (audio ? "audio" : "media")) + ".png) no-repeat center center";
          span.a.style.backgroundSize = "12px";
          span.b.textContent = count + '.';
          span.c.textContent = src.video;
          span.d.textContent = src.audio;
          /*  */
          button.appendChild(span.a);
          button.appendChild(span.b);
          button.appendChild(span.c);
          button.appendChild(span.d);
          button.appendChild(span.e);
          li.appendChild(button);
          page.menu.ul.appendChild(li);
          /*  */
          if (o.contentLength) {
            span.e.textContent = page.format.size(o.contentLength);
          } else {
            if (typeof o.url === "object") {
              span.e.textContent = "N/A";
            } else {
              span.e.textContent = "...";
              background.send("page:get-video-size", {"url": o.url});
            }
          }
        }
      };
      /*  */
      page.menu.ul.textContent = '';
      addmenuitem(null, null, "header");
      downloadlist.forEach(function (o, i) {addmenuitem(o, i, "mixed")});
      downloadlist.forEach(function (o, i) {addmenuitem(o, i, "audio")});
      downloadlist.forEach(function (o, i) {addmenuitem(o, i, "video")});
      /*  */
      var rect = document.getElementById(page.download.button.id).getClientRects()[0];
      var top = rect.top + window.scrollY + 50;
      var left = rect.left + window.scrollX - 6;
      var width = max > page.menu.max.width ? "410px" : "calc(100% - 22px)";
      var style = "width: " + width + "; top: " + top + "px; left:" + left + "px; position: absolute;";
      page.menu.ul.setAttribute("style", style);
      document.body.appendChild(page.menu.ul);
    }
  },
  "button": {
    "style": {"id": "ydl-page-button-style-id"},
    "insert": function () {
      var render = function (a, b) {
        var link = document.getElementById(page.button.style.id);
        if (!link) {
          link = document.createElement("link");
          link.setAttribute("type", "text/css");
          link.setAttribute("rel", "stylesheet");
          link.setAttribute("class", "ydl-button");
          link.setAttribute("id", page.button.style.id);
          link.setAttribute("href", chrome.runtime.getURL(page.root + "inject.css"));
          var head = document.documentElement || document.head || document.querySelector("head");
          if (head) head.appendChild(link);
        }
        /*  */
        var button = document.createElement("div");
        button.setAttribute("class", a);
        button.setAttribute("type", "button");
        button.setAttribute("role", "button");
        button.setAttribute("id", page.download.button.id);
        button.setAttribute("title", "Download this video");
        /*  */
        var icon = document.createElement("div");
        icon.setAttribute("id", page.download.icon.id);
        icon.setAttribute("class", b + "ytd-toggle-button-renderer");
        icon.style.background = "url(" + chrome.runtime.getURL(page.root + "icons/download.png") + ") no-repeat center center";
        icon.style.backgroundSize = "16px";
        /*  */
        button.appendChild(icon);
        return button;
      };
      /*  */
      var download = null;
      var manager = document.querySelector("#page-manager");
      var sentiment = document.querySelector("#watch8-sentiment-actions");
      var secondary = document.querySelector("#watch8-secondary-actions");
      var slimvideo = document.querySelector(".slim-video-metadata-actions");
      /*  */
      if (manager) { // #1
        var container = manager.querySelector('#menu-container');
        if (container) {
          var buttons = container.querySelector('#top-level-buttons');
          if (buttons) {
            download = render("style-scope ytd-menu-renderer force-icon-button style-text", "style-scope ");
            buttons.insertBefore(download, buttons.firstChild);
          }
        }
      } else if (sentiment) { // #2
        download = render("ydl-page-button-class-old", '');
        sentiment.insertBefore(download, sentiment.firstChild);
      } else if (secondary) { // #3
        download = render("ydl-page-button-class-old", '');
        secondary.insertBefore(download, secondary.lastChild);
      } else if (slimvideo) { // mobile
        download = render("ydl-page-button-class-mobile", '');
        slimvideo.insertBefore(download, slimvideo.firstChild);
      }
      /*  */
      return download;
    }
  }
};

background.receive("page:make-dropdown-menu", function (e) {
  var icon = document.getElementById(page.download.icon.id);
  if (icon && e.menu.length > 0) {
    var url = chrome.runtime.getURL(page.root + "icons/download.png");
    icon.style.background = "url(" + url + ") no-repeat center center";
    icon.style.backgroundSize = "16px";
    page.menu.show(e.title, e.menu);
  }
});

background.receive("page:set-video-size", function (e) {  
  var spans = document.querySelectorAll("span[ydl-d-u]");
  for (var i = 0; i < spans.length; i++) {
    var span = spans[i];
    if (span.getAttribute("ydl-d-u") === e.size[0]) {
      span.textContent = e.size[1] ? ' ' + page.format.size(e.size[1]) : "N/A";
      break;
    }
  }
});

if (page.interval.action) window.clearInterval(page.interval.action);
page.interval.action = window.setInterval(page.action, 1000);
