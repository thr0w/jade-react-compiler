```jade
Ifs
  Before
  if a
    When_a
  After_a
  if b
    When_b
  else
    When_not_b
  After_b
```
```javascript
function src(){
   return React.createElement(Ifs, null, function () {
     var $ret = [];
     $ret.push(React.createElement(Before));
     if (a) {
       $ret.push(React.createElement(When_a));
     }
     $ret.push(React.createElement(After_a));
     if (b) {
       $ret.push(React.createElement(When_b));
     } else {
       $ret.push(React.createElement(When_not_b));
     }
     $ret.push(React.createElement(After_b));
     return $ret;
  }());
}
```
