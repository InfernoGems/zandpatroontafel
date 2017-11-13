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


var html_library_item = '<li class="w3-display-container w3-border-flat-midnight-blue">{0}<span title="Opties" onclick="library_show_options({1});" class="w3-button w3-ripple w3-display-right w3-hover-flat-midnight-blue"><i class="fa fa-caret-down w3-large"></i></span></li>';

var html_library_options = '<span onclick="add_to_queue({1});" class="w3-button w3-ripple w3-hover-flat-wet-asphalt" style="width:100%; text-align:left;"><i class="fa fa-play w3-large" style="width:20px; margin-right:8px;"></i> Voeg toe aan wachtrij</span><br><span onclick="view_code({1});" class="w3-button w3-ripple w3-hover-flat-wet-asphalt" style="width:100%; text-align:left;"><i class="fa fa-code w3-large" style="width:20px; margin-right:8px;"></i> Bekijk code</span><br><span onclick="view_code({1});" class="w3-button w3-ripple w3-hover-flat-wet-asphalt" style="width:100%; text-align:left;"><i class="fa fa-download w3-large" style="width:20px; margin-right:8px;"></i> Download</span><br><span onclick="delete_pattern({1});" class="w3-button w3-ripple w3-hover-flat-wet-asphalt" style="width:100%; text-align:left;"><i class="fa fa-trash w3-large" style="width:20px; margin-right:8px;"></i> In prullenbak</span>';


// Set the HTML template for the list items in the queue
var queue_item = '';


function library_show_options(pattern) {
	var div = document.getElementById(pattern);

	if (div.getAttribute("options_shown") == "true") {
		div.childNodes[0].childNodes[1].setAttribute("class", "w3-button w3-ripple w3-hover-flat-wet-asphalt w3-display-right");
		div.childNodes[0].childNodes[1].childNodes[0].setAttribute("class", "fa fa-caret-down w3-large");
		var options_div = div.childNodes[1];
		div.removeChild(options_div);
		div.setAttribute("options_shown", "false");
	} else {
		var options_list = document.getElementById("options_list");
		if (options_list != null) {
			options_list.parentNode.setAttribute("options_shown", "false");
			options_list.parentNode.childNodes[1].setAttribute("class", "w3-button w3-ripple w3-hover-flat-midnight-blue w3-display-right");
			options_list.parentNode.childNodes[1].childNodes[0].setAttribute("class", "fa fa-caret-down w3-large");
			options_list.parentNode.removeChild(options_list);
		}
		//

		div.childNodes[0].childNodes[1].setAttribute("class", "w3-button w3-ripple w3-hover-flat-wet-asphalt w3-display-right w3-flat-midnight-blue");
		div.childNodes[0].childNodes[1].childNodes[0].setAttribute("class", "fa fa-caret-up w3-large");
		var div_options = document.createElement("div");
		div_options.setAttribute("class", "w3-flat-midnight-blue");
		
		var output_html = html_library_options;
			for (a = 0; a < 4; a++) {
				output_html = output_html.replace("{1}", "'"+ pattern +"'");
			}
		div_options.innerHTML = output_html;
		div_options.id = "options_list";
		div.appendChild(div_options);
		div.setAttribute("options_shown", "true");
	}
	
}


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
		var div = document.getElementById(filename);
		var code_div = document.createElement("div");
		code_div.innerHTML = '<li><pre><code>' +file_data+ '</code></pre></li>'
		div.appendChild(code_div);
		div.setAttribute("code_shown", "true");
		hljs.highlightBlock(code_div);
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
			var output_html = html_library_item.replace("{0}", library[i]);
			for (a = 0; a < 4; a++) {
				output_html = output_html.replace("{1}", "'"+ library[i] +"'");
			}
			
			var div = document.createElement("div");

			div.innerHTML = output_html;
			div.id = library[i];
			div.setAttribute("code_shown", "false");
			div.setAttribute("options_shown", "false");

			document.getElementById("id_library").appendChild(div);
		}

	});
}

// View code of pattern inside of the library
function view_code(pattern) {
	var div = document.getElementById(pattern);
	if (div.getAttribute("code_shown") == "true") {
		var code_div = div.childNodes[1];
		div.removeChild(code_div);
		div.setAttribute("code_shown", "false");
	} else {
		get_file(pattern);
		
	}

	
};

// Delete the pattern from the library
function delete_pattern(pattern) {
	// Confirmation dialog
	if (!confirm('Weet je zeker dat je het patroon '+' wil verwijderen? ')) {
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