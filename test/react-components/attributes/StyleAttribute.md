```jade
span(style={color: 'red', backgroundColor: "blue", width: "500px"})
  Test style attribute
```
```javascript
import {createClass, createElement} from "react";
function StyleAtribute()
{
  return createClass({
    displayName: "StyleAtribute",
    render: function() {
      return createElement("span", {style:{
        color: "red",
        backgroundColor: "blue",
        width: "500px"
      }}, ["Test style attribute"]);
    }
  })
}
module.exports = StyleAtribute;
```
