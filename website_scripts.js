// Name, Date added
var library_list = [["code.py", "10/09/2017"], ["test2.py", "10/09/2017"], ["test3.py", "10/09/2017"], ["test4.py", "10/09/2017"]];

// TODO: Get code from file

var library_item = '<li class="w3-display-container w3-border-flat-midnight-blue">{0}<span title="Verwijder patroon uit bibliotheek" onclick="delete_pattern({1});" class="w3-button w3-ripple w3-display-right w3-hover-red"><i class="fa fa-trash w3-large"></i></span><span title="Voeg patroon toe aan wachtrij" onclick="add_to_queue({1});" class="w3-button w3-ripple w3-display-right w3-hover-flat-midnight-blue" style="margin-right:46px;"><i class="fa fa-play w3-large"></i></span></li>';

var queue_item = '';

// Load the library
function load_library() {

	for (i = 0; i < library_list.length; i++) {
		var div_id = "'library_item_" + i + "'"
		
		var output_html = library_item.replace("{0}", library_list[i][0]);
		for (a = 0; a < 2; a++) {
			output_html = output_html.replace("{1}", div_id);
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
	// TODO
	alert("Deleted pattern " + pattern + ".");
	console.log(pattern);
	var div = document.getElementById(pattern);
	div.parentNode.removeChild(div);
}

// Add to queue
function add_to_queue(pattern) {
	// TODO
	alert("Added " + pattern + " to queue.");
}
