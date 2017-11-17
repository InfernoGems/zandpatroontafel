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


function initialize(){
	load_library();
	load_queue();
}


window.onload = function(){
	initialize();
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
				initialize();
			});
		}
		reader.readAsText(file);
	});
}


function upload_file() {
	document.getElementById('file_upload').click();
}


function replace_all(string, a, b){
	while (string.includes(a)){
		string = string.replace(a, b);
	}
	return string;
}


function get_file_contents(filename){
	
}
