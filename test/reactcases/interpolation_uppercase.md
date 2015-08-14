```jade
- var msg = "not my inside voice";
p This is #{msg.toUpperCase()}
```
```javascript
function src(){
  var msg = "not my inside voice";
  return React.createElement('p', null,
    'This is ', msg.toUpperCase()
  );
}
```
