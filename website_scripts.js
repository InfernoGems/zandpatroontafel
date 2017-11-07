var library_item = '<li class="w3-display-container w3-border-flat-midnight-blue">pattern_name <span title="Verwijder patroon uit bibliotheek" onclick="delete_pattern();" class="w3-button w3-ripple w3-display-right w3-hover-red"><i class="fa fa-trash w3-large"></i></span><span title="Voeg patroon toe aan wachtrij" onclick="add_to_list();" class="w3-button w3-ripple w3-display-right w3-hover-flat-midnight-blue" style="margin-right:46px;"><i class="fa fa-play w3-large"></i></span></li>';


var queue_item = '';

// Load the help
function load_help() {
	
}


// Load the library
function load_library() {
	var library_list = ["test.py", "test2.py", "test3.py", "test4.py"];

	for (i = 0; i < library_list.length; i++) {
		var output_html = library_item.replace("pattern_name", library_list[i]);
		var div = document.createElement('div');

		div.className = 'w3-display-container w3-border-flat-midnight-blue';

		div.innerHTML = output_html;
		div.id = "library_item_" + i;

		document.getElementById("id_library").appendChild(div);
	}
}