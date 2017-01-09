function save() {
  var key = document.getElementById('key').value;
  chrome.storage.sync.set({
	key: key
  }, function() {
	alert("Settings saved");
  });
}
function load() {
  chrome.storage.sync.get({
	key: '',
  }, function(items) {
	document.getElementById('key').value = items.key;
  });
  document.getElementById("btnSave").onclick = save;
}
document.addEventListener('DOMContentLoaded', load);