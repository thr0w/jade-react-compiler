```jade
div(class="content")
  Test one attribute
```
```javascript
import {createClass, createElement} from "react";
function OneAttribute()
{
  return createClass({
    displayName: "OneAttribute",
    render: function() {
      return createElement("div", {class:"content"}, ["Test one attribute"]);
    }
  })
}
module.exports = OneAttribute;
```
