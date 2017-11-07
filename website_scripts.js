// Name, Date added
var pin = '0000';
var library_list = [];

// TODO: Get code from file
var request = new XMLHttpRequest();
request.open('POST', '/')
request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
request.send(JSON.stringify({pin: pin, action: 'get_library'}));
request.onreadystatechange = function(){
	if (request.readyState == XMLHttpRequest.DONE) {
		var text = request.responseText;
		library_list = JSON.parse(text);
		load_library();
	}
}

var library_item = '<li class="w3-display-container w3-border-flat-midnight-blue">{0}<span title="Verwijder patroon uit bibliotheek" onclick="delete_pattern({1});" class="w3-button w3-ripple w3-display-right w3-hover-red"><i class="fa fa-trash w3-large"></i></span><span title="Voeg patroon toe aan wachtrij" onclick="add_to_queue({1});" class="w3-button w3-ripple w3-display-right w3-hover-flat-midnight-blue" style="margin-right:46px;"><i class="fa fa-play w3-large"></i></span></li>';

var queue_item = '';

function receive_data(method, data, callback){
	var request = new XMLHttpRequest();
	request.open(method, '/')
	request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
	request.send(JSON.stringify(data));
	request.onreadystatechange = function(){
		if (request.readyState == XMLHttpRequest.DONE) {
			callback(request);
		}
	}
}

// Load the library
function load_library() {

	for (i = 0; i < library_list.length; i++) {
		var div_id = "library_item_" + i
		
		var output_html = library_item.replace("{0}", library_list[i]);
		for (a = 0; a < 2; a++) {
			output_html = output_html.replace("{1}", "'"+div_id+"'");
		}
		
		var div = document.createElement("div");

		div.className = "w3-display-container w3-border-flat-midnight-blue";

		div.innerHTML = output_html;
		div.id = div_id;

		
		document.getElementById("id_library").appendChild(div);
	}
}




// Delete the pattern from the library
function delete_pattern(pattern) {
	if (!confirm('Weet je zeker dat je het patroon ' + pattern + ' wil verwijderen? ')){
		return;
	}

	var div = document.getElementById(pattern);
	div.parentNode.removeChild(div);

	// TODO: SEND TO SERVER
	var index = pattern.replace('library_item_', '');
	var name = library_list[index];


	var request = new XMLHttpRequest();
	request.open('POST', '/')
	request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
	request.send(JSON.stringify({pin: pin, action: 'delete_from_library', filename: name}));
	request.onreadystatechange = function(){
		if (request.readyState == XMLHttpRequest.DONE) {
			var text = request.responseText;
			var json = JSON.parse(text);
			if (json['status'] != 'success'){
				alert(json['status']);
			}
		}
	}
}

// Add to queue
function add_to_queue(pattern) {
	// TODO
	alert("Added " + pattern + " to queue.");

}
