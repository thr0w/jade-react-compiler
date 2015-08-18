```jade
//- Declaration
mixin list
  ul
    li foo
    li bar
    li baz
//- Use
div
  +list
  +list
```
```pending
```
```javascript
function src() {
   function list($ret, $block) {
       $ret.push(React.createElement('ul', null, React.createElement('li', null, 'foo'), React.createElement('li', null, 'bar'), React.createElement('li', null, 'baz')));
   }
   return React.createElement('div', null, function () {
       var $ret = [];
       list($ret);
       list($ret);
       return $ret;
     }());
}
```
