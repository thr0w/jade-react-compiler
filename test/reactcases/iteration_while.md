```jade
- var n: number = 0
ul
  while n < 4
    li= n++
```
```javascript
function src(n: number) {
  return React.createElement('ul', null, function () {
    var $ret = [];
    while (n < 4) {
      $ret.push(React.createElement('li', null, n++));
    }
    return $ret;
  }());  
}
```
