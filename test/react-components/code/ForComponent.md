```jade
div
  - for (var x = 0; x < 3; x++)
  li item #{x}
```
```javascript
import {createClass, createElement} from "react";
function ForComponent()
{
  var friends: number = 1;
  return createClass({
    displayName: "ForComponent",
    render: function() {
      var $ret = [];
      for (var x = 0; x < 3; x++){
        $ret.push(createElement("li", null, ["item " + x]));
      }
      return createElement("div", null, $ret);
    }
  })
}
module.exports = ForComponent;
```
