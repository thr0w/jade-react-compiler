```jade
div
  - var list: string[] = ["um", "dois", "tres", "quatro", "cinco"]
  each item in list
    li= item
```
```javascript
import {createClass, createElement} from "react";
function EachComponent()
{
  var list = ["um", "dois", "tres", "quatro", "cinco"]
  return createClass({
    displayName: "EachComponent",
    render: function() {
       var $ret = [];
       $ret = $ret.concat(list.map(function(item){
        return createElement("li", {}, [item]);
      }))
      return createElement("div", null, $ret);
    }
  })
}
module.exports = EachComponent;
```
