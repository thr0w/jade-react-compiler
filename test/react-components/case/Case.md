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
      return createElement('div', null, function () {
           var $ret = [];
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
module.exports = Case;
```
