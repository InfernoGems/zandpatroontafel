// Set the HTML template for the list items in the queue
const html_queue_item = '<li class="w3-display-container w3-border-0">{0}<span onclick="remove_queue_item(this);" class="w3-button w3-ripple w3-display-right w3-hover-light-grey"><i class="fa fa-times w3-large"></i></span><span onclick="move_up_in_queue(this);" class="w3-button w3-ripple w3-display-right w3-hover-light-grey" style="margin-right:48px;"><i class="fa fa-level-up w3-large"></i></span></li>';

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

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

function get_item_index(div, item) {
	var i = 0;
	var div_count = div;
	while((div_count = div_count.previousSibling) != null) i++;
  return i;
}

function remove_queue_item(item) {
  var div = item.parentNode.parentNode;

	queue.splice(get_item_index(div, item), 1);
	send_queue();
	div.parentNode.removeChild(div);
}


function send_queue(){
	communicate('POST', {pin: pin, action: 'send_queue', queue: queue}, function(r){});
}


function move_up_in_queue(item) {
  var div = item.parentNode.parentNode;

  var previous_index = get_item_index(div, item);
  queue.move(previous_index, previous_index -1);

  div.parentNode.insertBefore(div, div.parentNode.childNodes[previous_index-1]);

	send_queue();
}


// Add pattern to queue
function add_to_queue(pattern) {

	var output_html = replace_all(replace_all(html_queue_item, '{1}', "'" + pattern + "'"), "{0}", pattern);
	var div = document.createElement("div");

	div.innerHTML = output_html;
	document.getElementById("id_queue").appendChild(div);

	queue.push(pattern);
	send_queue();

}
