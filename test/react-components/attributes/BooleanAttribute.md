```jade
div
<<<<<<< HEAD
  input(className="checkbox1" type="checkbox" checkbox)
  | String
  input(className="checkbox2" type="checkbox" checkbox=true)
  | Number
  input(className="checkbox3" type="checkbox" checkbox=false)
  | Array
=======
  input(className="checkbox1" type="checkbox" checkbox) String
  input(className="checkbox2" type="checkbox" checkbox=true) Number
  input(className="checkbox3" type="checkbox" checkbox=false) Array
>>>>>>> 714e76405b956acc0bbe87c5b887b2027134e47d
```
```javascript
import {createClass, createElement} from "react";
function BooleanAttribute()
{
  return createClass({
    displayName: "BooleanAttribute",
    render: function() {
<<<<<<< HEAD
      return createElement("div", null, [
        createElement("input", {className: "checkbox1", type:"checkbox", checkbox: true}, "String"),
        createElement("input", {className: "checkbox2", type:"checkbox", checkbox: true}, "Number"),
        createElement("input", {className: "checkbox3", type:"checkbox", checkbox: false}, "Array")
      ]);
=======
      return createElement("div", null,
        createElement("input", {type:"checkbox", checkbox: true, className: "checkbox1"}, "String"),
        createElement("input", {type:"checkbox", checkbox: true, className: "checkbox2"}, "Number"),
        createElement("input", {type:"checkbox", checkbox: false, className: "checkbox3"}, "Array")
      );
>>>>>>> 714e76405b956acc0bbe87c5b887b2027134e47d
    }
  })
}
module.exports = BooleanAttribute;
```
