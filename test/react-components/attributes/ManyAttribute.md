```jade
- var classes: string[] = ["menu_item", "dark", "rustic"]
ul(class="menu")
  li(class=classes onClick=function(e){
     alert('Clicou no item!');
  }) Home
```
```javascript
import {createClass, createElement} from "react";
function ManyAttribute()
{
  var classes: string[] = ["menu_item", "dark", "rustic"];
  return createClass({
    displayName: "ManyAttribute",
    render: function() {
      return createElement("ul", {className:"menu"},
        createElement("li", {onClick:function(e){
          alert('Clicou no item!');
        }, className:classes}, "Home")
      );
    }
  })
}
module.exports = ManyAttribute;
```
