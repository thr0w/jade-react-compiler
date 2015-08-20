```jade
div
  - var list: string[] = ["um", "dois", "tres", "quatro", "cinco"]
  each item in list
    li= item
```
```javascript
import {createClass, createElement} from "react";
function EachComponent()
{
  var list: string[] = ["um", "dois", "tres", "quatro", "cinco"]
  return createClass({
    displayName: "EachComponent",
    render: function() {
      return createElement("div", null,
        list.map(function (item) {
                      return createElement('li', null, item)
        }))
    }
  })
}
module.exports = EachComponent;
```
