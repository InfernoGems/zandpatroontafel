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



function pause(){
	communicate('POST', {pin: pin, action: 'pause'}, function(r){})
}


function play(){
	communicate('POST', {pin: pin, action: 'play'}, function(r){})
}


function update_pause_icon(){

	var button_div = document.getElementById("pause_button");
	if (paused){
		button_div.setAttribute("class", "fa fa-play w3-large");
	} else {
		button_div.setAttribute("class", "fa fa-pause w3-large");
	}
}

function switch_pause(){
	var elem = document.getElementById('progress_bar');
	if (elem.innerHTML != "Klaar") {
		if (paused){
			play();
			paused = false;
			update_pause_icon();
		} else {
			pause();
			paused = true;
			update_pause_icon();
		}
	}
}

function update_current_pattern(){
	communicate('POST', {pin: pin, action: 'get_current'}, function(r){
		var elem = document.getElementById('progress_bar');
		var json = JSON.parse(r.responseText);

		if (!json['current_available']){
			elem.style.width = '100%';
			elem.innerHTML = 'Klaar';
			document.getElementById('progress_time').innerHTML = elapsed_time_holder + ' / ' + elapsed_time_holder + 's';
			return;
		}
		if (!paused){
			elapsed_time_holder = json['elapsed_time'];
			total_time_holder = json['time_left'] + json['elapsed_time'];
			document.getElementById('progress_time').innerHTML = elapsed_time_holder + ' / ' +  total_time_holder + 's';
			document.getElementById('filename').innerHTML = json['filename'];
			var target = json['percentage'] + '%';
			elem.innerHTML = target;
			elem.style.width = target;
		}
		load_queue();
	});
}


function load_queue() {
	communicate('POST', {pin: pin, action: 'get_paused'}, function(r){
		paused = JSON.parse(r.responseText)['paused'];
		update_pause_icon();
	});
	communicate('POST', {pin: pin, action: 'get_queue'}, function(r){
		new_queue = JSON.parse(r.responseText)['queue'];
		console.log(new_queue);
		if (queue == new_queue){
			return;
		}
		var id_queue = document.getElementById('id_queue');

		while (id_queue.hasChildNodes()){
			id_queue.removeChild(id_queue.childNodes[0]);
		}
		queue = new_queue;
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
    communicate('POST', {pin: pin, action: 'swap_current'}, function(r){});
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
