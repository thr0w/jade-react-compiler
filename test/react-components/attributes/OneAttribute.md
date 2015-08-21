```jade
div(class="content") Test one attribute
```
```javascript
import {createClass, createElement} from "react";
var OneAttribute = function ()
{
  return createClass({
    displayName: "OneAttribute",
    render: function() {
      return createElement("div", {className:"content"}, "Test one attribute");
    }
  })
}()
module.exports = OneAttribute;
```
