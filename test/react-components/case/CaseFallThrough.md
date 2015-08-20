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
  return createClass({
    displayName: "CaseFallThrough",
    render: function() {
      return createElement('div', null, function () {
          var $ret = [];
          var friends: number = 0;
          switch (friends) {
          case 0:
          case 1:
              $ret.push(createElement('p', null, 'you have very few friends'));
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
module.exports = CaseFallThrough;
```
