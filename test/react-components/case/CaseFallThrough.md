```jade
div
  - var friends: number = 0
  case friends
    when 0
    when 1
      p you have very few friends
    default
      p you have #{friends} friends
```
```javascript
import {createClass, createElement} from "react";
function CaseFallThrough()
{
  var friends: number = 0;
  return createClass({
    displayName: "CaseFallThrough",
    render: function() {
      var children = [];
      switch (friends) {
        case 0:
        case 1:
          children.push(createElement("p", {}, ["you have very few friends"]));
          break;
        default:
          children.push(createElement("p", {}, ["you have " + friends + " friends"]));
          break;
      }
      return createElement("div", null, [children]);
    }
  })
}
module.exports = CaseFallThrough;
```
