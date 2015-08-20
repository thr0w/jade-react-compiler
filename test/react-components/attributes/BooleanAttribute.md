```jade
div
  input(className="checkbox1" type="checkbox" checkbox)
  | String
  input(className="checkbox2" type="checkbox" checkbox=true)
  | Number
  input(className="checkbox3" type="checkbox" checkbox=false)
  | Array
```
```javascript
import {createClass, createElement} from "react";
var BooleanAttribute=(function ()
{
  return createClass({
    displayName: "BooleanAttribute",
    render: function() {
      return createElement("div", null,
        createElement("input", {type:"checkbox", checkbox: true, className: "checkbox1"}), "String",
        createElement("input", {type:"checkbox", checkbox: true, className: "checkbox2"}), "Number",
        createElement("input", {type:"checkbox", checkbox: false, className: "checkbox3"}), "Array"
      );
    }
  })
})()
module.exports = BooleanAttribute;
```
