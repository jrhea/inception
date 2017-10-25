requirejs.config({
    baseUrl: 'js/lib', 
	paths: {
		'pako': 'pako.min',
		'jquery':'jquery.min',
		'text':'text',
		'validate':'validate.min'
	}
    ,
	config: {
		text: {
			useXhr: function (url, protocol, hostname, port){
				// allow cross-domain requests
				return true;
			}			
		}
	}
});
require([
	'pako',
	'jquery',
	'validate'
], 
function(pako,jquery,validate) {
	"use strict";
	var command,target,resource,is_srcdoc;
	var url = new URL(location);
	
	command = url.searchParams.get("command");
	target = url.searchParams.get("target");
	resource = url.searchParams.get("resource");
	is_srcdoc = false;

	if(resource === "html"){
		resource = getHashPayload(location);
	}
	//detect if called from content in iframe's srcdoc
	else if(url.pathname === "srcdoc"){
		is_srcdoc = true;
		//TODO: make a more sophisticated method for detecting iframe events
		resource = getHashPayload(location);
		//event was fired from within iframe
		if(resource){
			//if we are in an iframe, set url back to parent url so that api can be called
			url = new URL(parent.location.origin + parent.location.pathname);
			//TODO: make these dynamic and defined by the source that is being loaded
			command="create";
			target="newWindow";
		}
	}
	
	if(command || target || resource){
		main();
	}

	function main(){
		if(command === "create"){
			
			if(isUri(resource)){
				
				// $.ajax({
					// url: resource,
					// dataType: 'html'
				// }).done(function(html) {
					// createHyperlink(html);
				// });
				
				require(['text!' + resource],
					function(text){
						createHyperlink(text);
					},
					function(err){
						console.log(err);
					}
				);
				
			}
			else{
				if(is_srcdoc){
					var element = eval(resource);
					if(element){
						createHyperlink(element.innerHTML);
					}
					else{
						console.log(resource + " is not in the DOM.")
					}
				}
				else{
					createHyperlink(resource);
				}
			}
		}
		else if(command === "load"){
			loadHyperlink();
		}
	}
	
	function createHyperlink(html){
		//change the command to load so the hyperlink instructs the api to load the resource
		command = "load";
		url.searchParams.set("command",command);
		url.searchParams.delete("source");
		url.searchParams.delete("target");
		url.searchParams.delete("resource");
		var hyperlink = url.href + "#?" + serialize(html.replace(/"/g, "'"));
		if(target === 'newWindow'){
			document.location=hyperlink;
		}
		else if(target === 'hyperlink'){
			document.body.innerHTML += "<a href= " + hyperlink + ">" + "Inception. it Is possible" + "</a>";
		}
	}
		
	function loadHyperlink(){
		var payload = getHashPayload(location);
		var deserializedPayload = deserialize(payload);
		var iframe = "<iframe id=\"contentFrame\" srcdoc=\"" + deserializedPayload + "\" style='position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;'><p>Your browser does not support iframes.</p></iframe>";
		document.body.innerHTML=iframe;

	}

	function getHashPayload(url) {
        // read the hash
        var hash = url.hash
          , dataPos
          , payload
          ;
        if(hash)
			// remove hashtag
            hash = hash.slice(1);
        if(!hash)
            return false;

        dataPos = hash.indexOf("?") + 1;
        if(dataPos === -1)
            return false;

        return hash.slice(dataPos);
    }
	
	function serialize(data) {
        return btoa(pako.deflate( JSON.stringify(data), { to: 'string' }));
    }

    function deserialize(payload) {
        return JSON.parse( pako.inflate( atob(payload), { to: 'string' }));
    }
	
	function isUri(resource){
		var result = true;
		var object = validate({website: resource},{
			website: {
				url: {
					allowLocal: true
				}
			}
		});
		//object undefined means that the resource is a valid uri
		if(object){
			result = false
		}
		return result;
	}
});
