"use strict";
var inceptionHost = inceptionHost || {};
inceptionHost.sub = (function() {
    var command,type,target,resource;
    var url = new URL(location);
    
    command = url.searchParams.get("command");
    type = url.searchParams.get("type");
    target = url.searchParams.get("target");
    resource = getHashPayload(location);
    
    if(!resource){
        init();
    }
    else
    {
        if(!command){
            command = "create";
            target = "hyperlink";
        }
        main();
    }

    function init(){
        var quill = new Quill('#editor-container', {
          modules: {
            syntax: true,
            toolbar: false
          },
          placeholder: 'type or paste html code here...'
          //theme: 'bubble'  // or 'snow'
        });
        document.getElementsByClassName("ql-editor")[0].innerHTML="<pre class=\"ql-syntax\" spellcheck=\"false\"></pre>"

        function onPublish() {
            var myLink = document.getElementById('mylink');
            var html = quill.getText();
            myLink.onclick = function(){
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "./js/main.js"; 
                document.getElementsByTagName("head")[0].appendChild(script);
                document.location.hash=serialize(html.replace(/"/g, "'"));
                return false;
            }
            document.getElementById('mylink').click(); 
        }
        document.getElementById("btnPublish").addEventListener("click", onPublish);

    }
    function main(){
        if(command === "create"){
            createHyperlink(resource);
        }
        else if(command === "load"){
            var deserializedPayload = deserialize(resource);
            loadHyperlink(deserializedPayload);
        }
    }
    
    function createHyperlink(){
        //change the command to load so the hyperlink instructs the api to load the resource
        command = "load";
        url.searchParams.set("command",command);
        url.searchParams.delete("source");
        url.searchParams.delete("target");
        url.searchParams.delete("resource");
        url.hash = "";
        var hyperlink = url.href + "#?" + resource;
        if(target === 'newWindow'){
            document.location=hyperlink;
        }
        else if(target === 'hyperlink'){
            document.body.innerHTML = "<a href= " + hyperlink + ">" + "Inception. It is possible." + "</a>";
        }
    }
        
    function loadHyperlink(deserializedPayload){
        //var iframe = "<iframe id=\"contentFrame\" srcdoc=\"" + deserializedPayload + "\" style='position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;'><p>Your browser does not support iframes.</p></iframe>";
        document.body.innerHTML=deserializedPayload;

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
        if(type=="data"){
            return pako.inflate( atob(payload), { to: 'string' });
        }
        else{
            return JSON.parse( pako.inflate( atob(payload), { to: 'string' }));
        }
    }
    
})();