```jade
ul
  each val, index in ['zero', 'one', 'two']
    li= index + ': ' + val
```
```javascript
function src() {
  return React.createElement('ul', null,
    (function($obj){
      return Object.keys($obj).map(function(index) {
         var val=$obj[index]
         return React.createElement('li', null, index + ': ' + val)
      })
    })(['zero', 'one', 'two'])
  );
}
```
