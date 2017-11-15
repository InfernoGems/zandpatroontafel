// Set the HTML template for the list items in the queue
const html_queue_item = '<li class="w3-display-container w3-border-0">{0}<span onclick="remove_queue_item(this);" class="w3-button w3-ripple w3-display-right w3-hover-light-grey"><i class="fa fa-times w3-large"></i></span><span onclick="move_up_in_queue(this);" class="w3-button w3-ripple w3-display-right w3-hover-light-grey" style="margin-right:48px;"><i class="fa fa-level-up w3-large"></i></span></li>';

function load_queue() {
	var id_queue = document.getElementById('id_queue');

	while (id_queue.hasChildNodes()){
		id_queue.removeChild(id_queue.childNodes[0]);
	}

	communicate('POST', {pin: pin, action: 'get_queue'}, function(r){
		queue = JSON.parse(r.responseText)['queue'];
		for (i = 0; i < queue.length; i++) {
			var output_html = replace_all(replace_all(html_queue_item, '{1}', "'" +  queue [i] + "'"), '{0}', queue[i])
			var div = document.createElement("div");

			div.innerHTML = output_html;
			document.getElementById("id_queue").appendChild(div);
		}

	});
}

function remove_queue_item(item) {
	var div = item.parentNode.parentNode;
	var i = 0;
	var div_count = div;

	while((div_count = div_count.previousSibling) != null) i++;
	
	queue.splice(i, 1);
	div.parentNode.removeChild(div);
}


function send_queue(){
	// TODO
}


function move_up_in_queue(item) {
	alert(item.innerHTML);
}


// Add pattern to queue
function add_to_queue(pattern) {
	communicate('POST', {pin: pin, action: 'add_to_queue', filename: pattern}, function(r){});

	var output_html = replace_all(replace_all(html_queue_item, '{1}', "'" + pattern + "'"), "{0}", pattern);
	var div = document.createElement("div");

	div.innerHTML = output_html;
	document.getElementById("id_queue").appendChild(div);

	queue.push(pattern);

}
