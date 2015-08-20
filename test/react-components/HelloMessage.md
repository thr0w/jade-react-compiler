```jade
- property name: string
div
  | Hello #{name}
```
```javascript
import {createClass, createElement} from "react";
var HelloMessage = (function ()
{
  var name: string;
  return createClass({
    displayName: "HelloMessage",
    render: function() {
      return createElement("div", null, "Hello ", name);
    },
    componentWillMount: function () {
        name = this.props.name;
    }
  })
})()
module.exports = HelloMessage
```
