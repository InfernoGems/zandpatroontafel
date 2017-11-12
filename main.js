var pin = '0000'; //prompt('Geef je pincode op');

function communicate(method, json, callback){
	var request = new XMLHttpRequest();
	request.open(method, '/');
	request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
	request.send(JSON.stringify(json));
	request.onreadystatechange = function(){
		if (request.readyState == XMLHttpRequest.DONE){
			callback(request);
		}
	}
}


window.onload = function(){
	load_library();
	var file_input = document.getElementById('file_upload');
	file_input.addEventListener('change', function(e) {
		var file = file_input.files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			var file_data = btoa(reader.result);
			communicate('POST', {pin: pin, action: 'upload', file_data: file_data, filename: file.name}, function(request){
				var text = request.responseText;
				var text = request.responseText;
				var json = JSON.parse(text);
				var status = json['status'];
				if (status != 'success'){
					alert(json['message']);
				}
				load_library();
			});
		}
		reader.readAsText(file);
	});
}

function choose_file() {
	var upload_div = document.getElementById('file_upload');
	upload_div.click();
}


// Set the HTML template for the list items in the library
var library_item = '<li class="w3-display-container w3-border-flat-midnight-blue">{0}<span title="Verwijder patroon uit bibliotheek" onclick="delete_pattern({1});" class="w3-button w3-ripple w3-display-right w3-hover-red"><i class="fa fa-trash w3-large"></i></span><span title="Voeg patroon toe aan wachtrij" onclick="add_to_queue({1});" class="w3-button w3-ripple w3-display-right w3-hover-flat-midnight-blue" style="margin-right:46px;"><i class="fa fa-play w3-large"></i></span><span title="Bekijk code" onclick="get_file({1});" class="w3-button w3-ripple w3-display-right w3-hover-flat-midnight-blue" style="margin-right:92px;"><i class="fa fa-code w3-large"></i></span></li>';

// Set the HTML template for the list items in the queue
var queue_item = '';


function get_file(filename){
	communicate('POST', {pin: pin, action: 'get_file', filename: filename}, function(r){
		var text = r.responseText;
		var json = JSON.parse(text);
		console.log(json);
		if (json['status'] != 'success'){
			alert(json['message']);
			return;
		}
		file_data = atob(json['file_data']);
		alert(file_data);
	});
}


// Populate the library with list items
function load_library() {
	var id_library = document.getElementById('id_library');
	while (id_library.hasChildNodes()){
		id_library.removeChild(id_library.childNodes[0]);
	}
	communicate('POST', {pin: pin, action: 'get_library'}, function(r){
		var library = JSON.parse(r.responseText)['library'];
		for (i = 0; i < library.length; i++) {
			var output_html = library_item.replace("{0}", library[i]);
			for (a = 0; a < 3; a++) {
				output_html = output_html.replace("{1}", "'"+ library[i] +"'");
			}
			
			var div = document.createElement("div");

			div.innerHTML = output_html;
			div.id = library[i];
			div.setAttribute("code_shown", "false");

			document.getElementById("id_library").appendChild(div);
		}

	});
}


// Delete the pattern from the library
function delete_pattern(pattern) {
	// Confirmation dialog
	if (!confirm('Weet je zeker dat je het patroon ' + pattern + ' wil verwijderen? ')) {
		return;
	}

	var div = document.getElementById(pattern);
	div.parentNode.removeChild(div);

	communicate('POST', {pin: pin, action: 'delete_from_library', filename: pattern}, function(r){
		var text = r.responseText;
		var json = JSON.parse(text);
		if (json['status'] != 'success'){
			alert(json['message']);
		}
	});
}

// Add pattern to queue
function add_to_queue(pattern) {
	// TODO
	alert("Added " + pattern + " to queue.");

}