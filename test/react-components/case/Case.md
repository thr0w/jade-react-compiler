```jade
div
  - var friends: number = 10
  case friends
    when 0
      p you have no friends
    when 1
      p you have a friends
    default
      p you have #{friends} friends
```
```javascript
import {createClass, createElement} from "react";
function Case()
{
  var friends: number = 10;
  return createClass({
    displayName: "Case",
    render: function() {
       var children = [];
       switch (friends) {
            case 0:
              children.push(createElement("p", {}, ["p you have no friend"]));
              break;
            case 1:
              children.push(createElement("p", {}, ["p you have a friend"]));
              break;
            default:
              children.push(createElement("p", {}, ["you have " + friends + " friends"]));
              break;
          }
        return createElement("div", null, [children]);
      }
  })
}
module.exports = Case;
```
