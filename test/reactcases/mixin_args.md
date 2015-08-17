```jade
mixin pet(name)
  li.pet= name
ul
  +pet('<cat>')
  +pet('&dog')
  +pet('pig')
```
```javascript
function src() {
   function pet($ret, name, $block) {
       $ret.push(React.createElement('li', { className: 'pet' }, name));
   }
   return React.createElement('ul', null, function () {
       var $ret = [];
       pet($ret, '<cat>');
       pet($ret, '&dog');
       pet($ret, 'pig');
       return $ret;
   }());
}
```
