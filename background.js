"use strict";

const supported = [
	{ ext: ["m3u8"],          ct: ["application/x-mpegurl", "application/vnd.apple.mpegurl"], type: "HLS"},
	{ ext: ["m3u"],           ct: ["audio/x-mpequrl"], type: "M3U" },
      //{ ext: ["ts"],            ct: ["video/MP2T"], type: "TS" }, // Not Added Bcoz Start Detect all .TS files 
	{ ext: ["mpd"],           ct: ["application/dash+xml"], type: "DASH" },
	{ ext: ["f4m"],           ct: ["application/f4m"], type: "HDS" },
	{ ext: ["ism"],           ct: [], type: "MSS" },
	{ ext: ["vtt"],           ct: ["text/vtt"], type: "VTT" },
	{ ext: ["avi"],           ct: ["video/x-msvideo"], type: "AVI" },
      //{ ext: ["mp4"],           ct: ["video/mp4"], type: "MP4" }, // Not Added bcoz start detect YouTube Links Also 
        { ext: ["mkv"],           ct: ["video/x-matroska"], type: "MKV" },
	{ ext: ["srt"],           ct: ["application/x-subrip"], type: "SRT" },
	{ ext: ["mp3"],           ct: ["audio/mpeg"], type: "MP3" },
	{ ext: ["m4a"],           ct: ["audio/m4a"], type: "M4A" },
      //{ ext: ["webm"],          ct: ["video/webm", "audio/webm"], type: "WEBM" }, // Not Added bcoz start detect YouTube Links Also 
	{ ext: ["ttml", "ttml2"], ct: ["application/ttml+xml"], type: "TTML" },
	{ ext: ["dfxp"],          ct: ["application/ttaf+xml"], type: "DFXP" }
];

const _ = chrome.i18n.getMessage;

const manifestVersion = chrome.runtime.getManifest().version;

let urlStorage = [];
let urlStorageRestore = [];
let badgeText = 0;
let queue = [];
let notifPref = false;

const urlFilter = (requestDetails) => {
	let e;

	if (requestDetails.requestHeaders) {
		const url = new URL(requestDetails.url).pathname.toLowerCase();
		// go through the extensions and see if the url contains any
		e = supported.find((f) => f.ext.some((fe) => url.includes("." + fe)));
	} else if (requestDetails.responseHeaders) {
		const header = requestDetails.responseHeaders.find(
			(h) => h.name.toLowerCase() === "content-type"
		);
		if (header)
			// go through content types and see if the header matches
			e = supported.find((f) => f.ct.includes(header.value.toLowerCase()));
	}
	if (
		e &&
		!urlStorage.find((u) => u.url === requestDetails.url) && // urlStorage because promises are too slow sometimes
		!queue.includes(requestDetails.requestId) // queue in case urlStorage is also too slow
	) {
		queue.push(requestDetails.requestId);
		requestDetails.type = e.type;
		addURL(requestDetails);
	}
};

const addURL = (requestDetails) => {
	const url = new URL(requestDetails.url);

	const urlPath = url.pathname.toLowerCase();
	// eslint-disable-next-line no-nested-ternary
	const filename = +urlPath.lastIndexOf("/")
		? urlPath.slice(urlPath.lastIndexOf("/") + 1)
		: urlPath[0] === "/"
		? urlPath.slice(1)
		: urlPath;

	const { hostname } = url;
	const timestamp = Date.now();
	// depends on which listener caught it
	const headers =
		requestDetails.requestHeaders || requestDetails.responseHeaders;

	chrome.tabs.get(requestDetails.tabId, (tabData) => {
		const newRequestDetails = {
			...requestDetails,
			headers,
			filename,
			hostname,
			timestamp,
			tabData
		};

		urlStorage.push(newRequestDetails);

		badgeText = urlStorage.length;
		chrome.browserAction.setBadgeBackgroundColor({ color: "#0e93ef" });
		chrome.browserAction.setBadgeText({
			text: badgeText.toString()
		});

		chrome.storage.local.set({ urlStorage, badgeText }, () => {
			chrome.runtime.sendMessage({ urlStorage: true }); // update popup if opened
			queue = queue.filter((q) => q !== requestDetails.requestId); // processing finished - remove from queue
		});
	});

	if (notifPref === false) {
		chrome.notifications.create("add", {
			// id = only one notification of this type appears at a time
			type: "basic",
			iconUrl: "img/icon-dark-96.png",
			title: _("notifTitle"),
			message: _("notifText", requestDetails.type) + filename
		});
	}
};

const deleteURL = (message) => {
	// url deletion
	if (message.previous === false) {
		urlStorage = urlStorage.filter(
			(url) =>
				!message.delete
					.map((msgUrl) => msgUrl.requestId)
					.includes(url.requestId)
		);
		badgeText = urlStorage.length;
	} else {
		urlStorageRestore = urlStorageRestore.filter(
			(url) =>
				!message.delete
					.map((msgUrl) => msgUrl.requestId)
					.includes(url.requestId)
		);
	}

	chrome.storage.local.set({ urlStorage, urlStorageRestore, badgeText }, () => {
		chrome.runtime.sendMessage({ urlStorage: true });
		if (message.previous === false)
			chrome.browserAction.setBadgeText({
				text: badgeText === 0 ? "" : badgeText.toString() // only display at 1+
			});
	});
};

const setup = () => {
	// clear everything and/or set up
	chrome.browserAction.setBadgeText({ text: "" });

	chrome.storage.local.get((options) => {
		if (
			(options.version &&
				(options.version.split(".")[0] < manifestVersion.split(".")[0] ||
					(options.version.split(".")[0] === manifestVersion.split(".")[0] &&
						options.version.split(".")[1] < manifestVersion.split(".")[1]))) ||
			!options.version
		)
			chrome.storage.local.clear();

		chrome.storage.local.set(
			{
				// first init also happens here
				disablePref: options.disablePref || false,
				copyMethod: options.copyMethod || "url",
				headersPref: options.headersPref || true,
				streamlinkOutput: options.streamlinkOutput || "file",
				downloaderPref: options.downloaderPref || false,
				downloaderCommand: options.downloaderCommand || "",
				proxyPref: options.proxyPref || false,
				proxyCommand: options.proxyCommand || "",
				customCommand: options.customCommand || "",
				userCommand: options.userCommand || "",
				notifPref: options.notifPref || false,
				urlStorageRestore: options.urlStorageRestore || [],
				version: manifestVersion
			},
			() => {
				if (!options.disablePref || options.disablePref === false) {
					chrome.webRequest.onBeforeSendHeaders.addListener(
						urlFilter,
						{ urls: ["<all_urls>"] },
						["requestHeaders"]
					);
					chrome.webRequest.onHeadersReceived.addListener(
						urlFilter,
						{ urls: ["<all_urls>"] },
						["responseHeaders"]
					);
				}

				notifPref = options.notifPref || false;

				if (options.urlStorageRestore && options.urlStorageRestore.length > 0)
					// eslint-disable-next-line prefer-destructuring
					urlStorageRestore = options.urlStorageRestore;

				if (options.urlStorage && options.urlStorage.length > 0)
					urlStorageRestore = [...urlStorageRestore, ...options.urlStorage];

				// restore urls on startup
				if (urlStorageRestore.length > 0)
					chrome.storage.local.set({
						urlStorageRestore,
						urlStorage: []
					});
			}
		);
	});

	chrome.runtime.onMessage.addListener((message) => {
		if (message.delete) deleteURL(message);
		else if (message.options) {
			chrome.storage.local.get((options) => {
				if (
					options.disablePref === true &&
					chrome.webRequest.onBeforeSendHeaders.hasListener(urlFilter) &&
					chrome.webRequest.onHeadersReceived.hasListener(urlFilter)
				) {
					chrome.webRequest.onBeforeSendHeaders.removeListener(urlFilter);
					chrome.webRequest.onHeadersReceived.removeListener(urlFilter);
				} else if (
					options.disablePref === false &&
					!chrome.webRequest.onBeforeSendHeaders.hasListener(urlFilter) &&
					!chrome.webRequest.onHeadersReceived.hasListener(urlFilter)
				) {
					chrome.webRequest.onBeforeSendHeaders.addListener(
						urlFilter,
						{ urls: ["<all_urls>"] },
						["requestHeaders"]
					);
					chrome.webRequest.onHeadersReceived.addListener(
						urlFilter,
						{ urls: ["<all_urls>"] },
						["responseHeaders"]
					);
				}

				// eslint-disable-next-line prefer-destructuring
				notifPref = options.notifPref;
			});
		}
	});
};

setup();
