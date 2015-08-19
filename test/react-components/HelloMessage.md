```jade
- property name: string
div
  | Hello #{name}
```
```javascript
import {createClass, createElement} from "react";
function HelloMessage(name: string)
{
  return createClass({
    displayName: "HelloMessage",
    render: function() {
      return createElement("div", null, "Hello ", name);
    }
  })
}
module.exports = HelloMessage
```
