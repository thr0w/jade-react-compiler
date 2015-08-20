```jade
span(style={color: 'red', backgroundColor: "blue", width: "500px"}) Test style attribute
```
```javascript
import {createClass, createElement} from "react";
function StyleAttribute()
{
  return createClass({
    displayName: "StyleAttribute",
    render: function() {
      return createElement("span", {style:{
        color: "red",
        backgroundColor: "blue",
        width: "500px"
      }}, "Test style attribute");
    }
  })
}
module.exports = StyleAttribute;
```
