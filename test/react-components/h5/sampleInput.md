```jade
script.
  import {EditStore} from "./EditStore.ts";
  import {Input} from "./input.ts";
- reference editStore: EditStore
- reference HInput: Input
Input(store= EditStore field= "name")
```
```javascript
import {
    createClass,
    createElement
} from 'react';
import { EditStore } from './EditStore.ts';
import { Input } from './input.ts';
var ComplexAttribute = function () {
    var editStore: EditStore.TYPE, HInput: Input.TYPE;
    return createClass({
        displayName: 'ComplexAttribute',
        render: function () {
            return createElement(Input, {
                store: EditStore,
                field: 'name'
            });
        },
        componentWillMount: function () {
            editStore = EditStore.addRef();
            HInput = Input.addRef();
        },
        componentWillUnmount: function () {
            editStore.releaseRef();
            HInput.releaseRef();
        }
    });
}();
module.exports = ComplexAttribute;
```
