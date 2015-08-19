```jade
- var classes: string[] = ["menu_item", "dark", "rustic"]
ul(class="menu")
  li(class=classes onClick=function(e){
     alert('Clicou no item!');
  })= Home
```
```javascript
import {createClass, createElement} from "react";
function ManyAtribute()
{
  var classes: string[] = ["menu_item", "dark", "rustic"];
  return createClass({
    displayName: "ManyAtribute",
    render: function() {
      return createElement("ul", {class:"menu"}, [
        createElement("li", {class:classes, onClick:function(){
          alert('Clicou no item!');
        }}, ["Home"])
      ]);
    }
  })
}
module.exports = ManyAtribute;
```
