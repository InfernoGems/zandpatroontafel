// Set the HTML template for the list items in the queue
const html_queue_item = '<li name="{0}" class="w3-display-container w3-border-0">{0}<span onclick="remove_queue_item(this);" class="w3-button w3-ripple w3-display-right w3-hover-light-grey"><i class="fa fa-times w3-large"></i></span><span onclick="move_up_in_queue(this);" class="w3-button w3-ripple w3-display-right w3-hover-light-grey" style="margin-right:48px;"><i class="fa fa-level-up w3-large"></i></span></li>';

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


function update_current_pattern(){
	communicate('POST', {pin: pin, action: 'get_current'}, function(r){
		var elem = document.getElementById('progress_bar');
		var json = JSON.parse(r.responseText);
		if (!json['current_available']){return;}
		var target = json['percentage'];
		var current_width = elem.innerHTML.substring(0, elem.innerHTML.length - 1)
		elem.innerHTML = target + "%";
		setInterval(function(){
			if (current_width < target) {
				current_width ++;
				elem.style.width = current_width + '%';
				//elem.innerHTML = current_width + '%';
			} else if (current_width > target) {
				current_width = 0;
				elem.style.width = "0%";
				//elem.innerHTML = "0%";
			}
			
		}, 10);

	});
}


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
  if (previous_index == 0) {
    // Push pattern to be the currently executed pattern
    if (!confirm('Weet je zeker dat je het patroon dat nu bezig is wil vervangen door code.py? ')) {
      return;
    }
  } else {
    queue.move(previous_index, previous_index -1);

    div.parentNode.insertBefore(div, div.parentNode.childNodes[previous_index-1]);

    send_queue();
  }
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
