```jade
div
  - var friends: number = 1
  case friends
    when 0: p you have no friends
    when 1: p you have a friends
    default: p you have #{friends} friends
```
```javascript
import {createClass, createElement} from "react";
function BlockExpansion()
{
  return createClass({
    displayName: "BlockExpansion",
    render: function() {
      return createElement('div', null, function () {
           var $ret = [];
           var friends: number = 1;
           switch (friends) {
           case 0:
               $ret.push(createElement('p', null, 'you have no friends'));
               break;
           case 1:
               $ret.push(createElement('p', null, 'you have a friends'));
               break;
           default:
               $ret.push(createElement('p', null, 'you have ', friends, ' friends'));
               break;
           }
           return $ret;
        }());
      }
  })
}
module.exports = BlockExpansion;
```
