```jade
- reference name: Store
div
  | Hello #{name}
```
```javascript
import {createClass, createElement} from "react";
function HelloMessageWithReference()
{
  var name: Store.TYPE
  return createClass({
    displayName: "HelloMessageWithReference",
    render: function() {
      return createElement("div", null, "Hello ", name);
    },
    componentWillMount: function() {
       name = Store.addRef();
    },
    componentWillUnmount: function() {
       name.releaseRef();
    }
  })
}
module.exports = HelloMessageWithReference
```
