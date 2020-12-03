var domChanges = [];

// load add-on config
function loadAddonConfig() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			var config = JSON.parse(this.responseText);  
						
			if (config.domChanges) {
				domChanges = config.domChanges;
			}
		}
	};
	
	xhttp.open("GET", chrome.extension.getURL("data/configuration.json"), true);
	xhttp.overrideMimeType('application/json');
	xhttp.send();
}

loadAddonConfig();

function handleMessage(message, sender) {
	if (message.action == 'doDownload') {

		//chrome.tabs.create({url: message.url});
                var downloading = chrome.downloads.download({url: message.url, filename: message.title_name, conflictAction : 'uniquify'});
                //var downloading = chrome.downloads.download({url: message.url, conflictAction: 'uniquify', saveAs: true});
                //var downloading = chrome.downloads.download({url: message.url, filename: 'A.mp4', conflictAction : 'uniquify'});

	} else if (message.action == 'getEmbedOverlay') {

		chrome.tabs.sendMessage(sender.tab.id, {'action': 'applyEmbedOverlay', 'url': chrome.extension.getURL("data/download-white.png")});

	} else if (message.action == 'getDOMChanges') {

		for (var i = 0; i < domChanges.length; i++) {
			var content = domChanges[i].content;
			
			content = content.replace('##download-icon-url##', chrome.extension.getURL("data/download.png"));
						
			chrome.tabs.sendMessage(sender.tab.id, {'action': 'applyDOMChanges', 'type': domChanges[i].type, 'selector': domChanges[i].selector, 'content': content, 'content_id': domChanges[i].content_id});
		}
		
		chrome.tabs.sendMessage(sender.tab.id, {'action': 'applyDOMActions'});
	}
}

chrome.runtime.onMessage.addListener(handleMessage);

