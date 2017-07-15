## Inception Host

URL params are used to interface with Inception Host.  

### API

The API consists of these url params:

***command*** = create | load 

***target*** = hyperlink | newWindow

***resource*** = [url] | [DOM element]

### Example

Display a hyperlink that hosts a html file.

***Host editor.html from a hyperlink:***

 `https://jrhea.github.io/inception/?command=create&target=hyperlink&resource=https://jrhea.github.io/inception/editor.html`
 

***Note:*** If you want it to automatically open in a new window, change: 

`target=hyperlink` to `target=newWindow`
