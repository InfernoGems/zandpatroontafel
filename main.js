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
	load_queue();
	var file_input = document.getElementById('file_upload');
	file_input.addEventListener('change', function(e) {
		var file = file_input.files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			var file_data = btoa(reader.result);
			communicate('POST', {pin: pin, action: 'upload', file_data: file_data, filename: file.name}, function(request){
				var json = JSON.parse(request.responseText);
				if (json['status'] != 'success'){
					alert(json['message']);
				}
				load_library();
				load_queue();
			});
		}
		reader.readAsText(file);
	});
}


function upload_file() {
	document.getElementById('file_upload').click();
}


// HTML Element templates
var html_library_item = '<li class="w3-display-container w3-border-0">{0}<span id="button_{0}" onclick="library_toggle_options({1});" class="w3-button w3-ripple w3-display-right w3-hover-light-grey"><i class="fa fa-caret-down w3-large"></i></span></li>';

var html_library_options = '<span onclick="add_to_queue({1});" class="w3-button w3-ripple w3-hover-white" style="width:100%; text-align:left;"><i class="fa fa-play w3-large" style="width:20px; margin-right:8px;"></i> Voeg toe aan wachtrij</span><br><span onclick="view_code({1});" class="w3-button w3-ripple w3-hover-white" style="width:100%; text-align:left;"><i class="fa fa-code w3-large" style="width:20px; margin-right:8px;"></i> Bekijk code</span><br><span onclick="view_code({1});" class="w3-button w3-ripple w3-hover-white" style="width:100%; text-align:left;"><i class="fa fa-download w3-large" style="width:20px; margin-right:8px;"></i> Download</span><br><span onclick="delete_pattern({1});" class="w3-button w3-ripple w3-hover-white" style="width:100%; text-align:left;"><i class="fa fa-trash w3-large" style="width:20px; margin-right:8px;"></i> In prullenbak</span>';


// Set the HTML template for the list items in the queue
var html_queue_item = '<li class="w3-display-container w3-border-0">{0}<span onclick="remove_queue_item(this);" class="w3-button w3-ripple w3-display-right w3-hover-light-grey"><i class="fa fa-times w3-large"></i></span><span onclick="move_up_in_queue(this);" class="w3-button w3-ripple w3-display-right w3-hover-light-grey" style="margin-right:48px;"><i class="fa fa-level-up w3-large"></i></span></li>';


function close_other_options(excluded_pattern) {
	var div_library = document.getElementById("id_library");
	for (var i = 0; i < div_library.childNodes.length; i++) {
		
		var div_element = div_library.childNodes[i];
		
		if (div_element.id != excluded_pattern) {
			
			div_element.setAttribute("options_shown", "false");

			var button_element = document.getElementById("button_" + div_element.id);
			button_element.setAttribute("class", "w3-button w3-ripple w3-display-right w3-hover-light-grey");
			button_element.innerHTML = '<i class="fa fa-caret-down w3-large"></i>';

			var div_options = div_element.childNodes[1];
			if (div_options != null) {
				div_element.removeChild(div_options);
			}
		}

	}
}


// In the library, this function gets called when the "show options"-button is pressed
// - closes the other open option <div> elements
// - opens the options <div> element for the pressed pattern
function library_toggle_options(pattern) {

	var div_pattern = document.getElementById(pattern); // The pattern to open its options <div> element

	if (div_pattern.getAttribute("options_shown") == "true") { // Destroy the options <div> element

		div_pattern.childNodes[0].childNodes[1].setAttribute("class", "w3-button w3-ripple w3-hover-light-grey w3-display-right"); // Set options button class color back to normal
		div_pattern.childNodes[0].childNodes[1].childNodes[0].setAttribute("class", "fa fa-caret-down w3-large"); // Set options button icon back to fa_caret_down

		var options_div = div_pattern.childNodes[1]; // The options <div> element
		div_pattern.removeChild(options_div); // Removes the complete <div> element
		div_pattern.setAttribute("options_shown", "false");

	} else { // Create the options <div> element
		
		close_other_options(pattern); // Closes the other option <div> elements with as the first argument the current pattern, which will be excluded from the function


		div_pattern.childNodes[0].childNodes[1].setAttribute("class", "w3-button w3-ripple w3-hover-light-grey w3-display-right w3-light-grey"); // Set options button class color to open (matches the color of the options <div> element)
		div_pattern.childNodes[0].childNodes[1].childNodes[0].setAttribute("class", "fa fa-caret-up w3-large"); // Set options button icon to fa_caret_up
		
		// Create the options <div> element
		var div_options = document.createElement("div");
		div_options.setAttribute("class", "w3-light-grey");
		
		// Set the target for the functions inside the options <div> element
		var output_html = html_library_options;
		for (var a = 0; a < 4; a++) {
			output_html = output_html.replace("{1}", "'"+ pattern +"'");
		}

		div_options.innerHTML = output_html;
		div_options.id = "options_list";
		div_pattern.appendChild(div_options);
		
		div_pattern.setAttribute("options_shown", "true");
	}
	
}


function get_file_contents(filename){
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
			var output_html = html_library_item;
			for (a = 0; a < 4; a++) {
				output_html = output_html.replace("{1}", "'"+ library[i] +"'").replace("{0}", library[i]);
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



function load_queue() {
	var id_queue = document.getElementById('id_queue');
	while (id_queue.hasChildNodes()){
		id_queue.removeChild(id_queue.childNodes[0]);
	}
	communicate('POST', {pin: pin, action: 'get_queue'}, function(r){
		queue = JSON.parse(r.responseText)['queue'];
		console.log(queue);
		for (i = 0; i < queue.length; i++) {
			var output_html = html_queue_item;
			for (a = 0; a < 4; a++) {
				output_html = output_html.replace("{1}", "'"+ queue[i] +"'").replace("{0}", queue[i]);
			}
			
			var div = document.createElement("div");

			div.innerHTML = output_html;
			document.getElementById("id_queue").appendChild(div);
		}

	});
}

// View code of pattern inside of the library
function view_code(pattern) {
	get_file_contents(pattern);
	document.getElementById('code_modal').style.display='block'

	
};

function modal_close(modal_id) {
	document.getElementById(modal_id).style.display='none';
}


// Delete the pattern from the library
function delete_pattern(pattern) {
	// Confirmation dialog

	var div = document.getElementById(pattern);

	if (!confirm('Weet je zeker dat je het patroon '+div.id+' wil verwijderen? ')) {
		return;
	}

	
	div.parentNode.removeChild(div);

	communicate('POST', {pin: pin, action: 'delete_from_library', filename: pattern}, function(r){
		var text = r.responseText;
		var json = JSON.parse(text);
		if (json['status'] != 'success'){
			alert(json['message']);
		}
	});
}


function remove_queue_item(item) {
	var div = item.parentNode.parentNode;

	var i = 0;
	var div_count = div;
	while( (div_count = div_count.previousSibling) != null ) 
	  i++;
	
	queue.splice(i, 1);

	div.parentNode.removeChild(div);

}


function move_up_in_queue(item) {
	alert(item.innerHTML);
}


// Add pattern to queue
function add_to_queue(pattern) {
	communicate('POST', {pin: pin, action: 'add_to_queue', filename: pattern}, function(r){});
	
	var output_html = html_queue_item;
	for (a = 0; a < 4; a++) {
		output_html = output_html.replace("{1}", "'"+ pattern +"'").replace("{0}", pattern);
	}
	
	var div = document.createElement("div");

	div.innerHTML = output_html;
	document.getElementById("id_queue").appendChild(div);

	queue.push(pattern);

}