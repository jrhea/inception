## Hyperlink Host

URL params are used to interface with Hyperlink Host.  

### API

The API consists of these url params:

***command*** = create | load 

***target*** = hyperlink | newWindow

***resource*** = [url] | [DOM element]

### Example

Display a hyperlink that hosts a html file.

***Host editor.html from a hyperlink:***

 `http://127.0.0.1:3000/index.html?command=create&target=hyperlink&resource=http://127.0.0.1:3000/editor.html`
 

***Note:*** If you want it to automatically open in a new window, change: 

`target=hyperlink` to `target=newWindow`
