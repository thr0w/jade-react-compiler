```jade
div
  input(className="checkbox1" type="checkbox" checkbox)
    String
  input(className="checkbox2" type="checkbox" checkbox=true)
    Number
  input(className="checkbox3" type="checkbox" checkbox=false)
    Array
```
```javascript
import {createClass, createElement} from "react";
function BooleanAttribute()
{
  return createClass({
    displayName: "BooleanAttribute",
    render: function() {
      return createElement("div", null, [
        createElement("input", {className: "checkbox1", type:"checkbox", checkbox: true}, ["String"]),
        createElement("input", {className: "checkbox2", type:"checkbox", checkbox: true}, ["Number"]),
        createElement("input", {className: "checkbox3", type:"checkbox", checkbox: false}, ["Array"])
      ]);
    }
  })
}
module.exports = BooleanAttribute;
```
