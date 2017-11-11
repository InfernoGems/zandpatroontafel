var pin = '0000';
var library_list = [];

function request_setup() {
	request = new XMLHttpRequest();
	request.open('POST', '/')
	request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
}

// Choose file
function choose_file() {
	var upload_button = document.getElementById("file_upload");
	upload_button.click();
	console.log(upload_button['upload_button'].files)
}

// Get contents of the library
request_setup();
request.send(JSON.stringify({pin: pin, action: 'get_library'}));
request.onreadystatechange = function(){
	if (request.readyState == XMLHttpRequest.DONE) {
		var text = request.responseText;
		library_list = JSON.parse(text);
		load_library();
	}
}

// Set the HTML template for the list items in the library
var library_item = '<li class="w3-display-container w3-border-flat-midnight-blue">{0}<span title="Verwijder patroon uit bibliotheek" onclick="delete_pattern({1});" class="w3-button w3-ripple w3-display-right w3-hover-red"><i class="fa fa-trash w3-large"></i></span><span title="Voeg patroon toe aan wachtrij" onclick="add_to_queue({1});" class="w3-button w3-ripple w3-display-right w3-hover-flat-midnight-blue" style="margin-right:46px;"><i class="fa fa-play w3-large"></i></span></li>';

// Set the HTML template for the list items in the queue
var queue_item = '';


// Populate the library with list items
function load_library() {

	for (i = 0; i < library_list.length; i++) {
		var output_html = library_item.replace("{0}", library_list[i]);
		for (a = 0; a < 2; a++) {
			output_html = output_html.replace("{1}", "'"+ library_list[i] +"'");
		}
		
		var div = document.createElement("div");

		div.innerHTML = output_html;
		div.id = library_list[i];

		document.getElementById("id_library").appendChild(div);
	}
}


// Delete the pattern from the library
function delete_pattern(pattern) {
	// Confirmation dialog
	if (!confirm('Weet je zeker dat je het patroon ' + pattern + ' wil verwijderen? ')) {
		return;
	}

	var div = document.getElementById(pattern);
	div.parentNode.removeChild(div);

	request_setup();
	request.send(JSON.stringify({pin: pin, action: 'delete_from_library', filename: pattern}));
	request.onreadystatechange = function() {
		if (request.readyState == XMLHttpRequest.DONE) {
			var text = request.responseText;
			var json = JSON.parse(text);
			if (json['status'] != 'success') {
				alert(json['status']);
			}
		}
	}
}

// Add pattern to queue
function add_to_queue(pattern) {
	// TODO
	alert("Added " + pattern + " to queue.");

}