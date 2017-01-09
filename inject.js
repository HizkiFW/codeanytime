window.lastHeartbeat = 0;
console.log("CodeAnyTime loaded");
window.onkeydown = function(e) {
	if(e.ctrlKey) { //IDK why but it doesn't detect Ctrl-S. Probably interferes with CA's event listeners
		//(assume) File saved
		console.log("Saved");
		var f = ($(".active > .tooltip").data("tip") || $(".active > .tooltip").attr("title")).split(" › ");
		var fName = f[1];
		var pName = f[0];
		chrome.storage.sync.get({
			lastHeartbeat: 0
		}, function(d) {
			if(new Date().getTime() - d.lastHeartbeat > 120000) {
				chrome.storage.sync.set({
					lastHeartbeat: new Date().getTime()
				}, function() {});
				heartbeat(fName, pName);
			}
		});
	}
}

function getChromeVersion() {     
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

    return raw ? parseInt(raw[2], 10) : false;
}

function heartbeat(file, project) {
	console.log("Heartbeat");
	chrome.storage.sync.get({
		key: 'NONE',
	}, function(items) {
		if(items.key == 'NONE') alert('Please set your API key in the settings page');
		var k = window.btoa(':' + items.key);
		$.ajax({
			url: 'https://wakatime.com/api/v1/users/current/heartbeats',
			type: 'post',
			data: JSON.stringify({
				"project": project,
				"entity": file,
				"type": "file",
				"time": new Date().getTime()/1000
			}),
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Basic " + k,
				//"User-Agent": "wakatime/1.0.0 (Chrome " + getChromeVersion() + ") JavaScript CodeAnyTime"
			},
			dataType: 'raw',
			success: function(data) {
				console.log(data);
			}
		});
	});
}