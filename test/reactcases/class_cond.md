```jade
- var authenticated = true
div(class=authenticated ? 'authed' : 'anon')
```
```javascript
function src(){
  var authenticated = true;
  return React.createElement('div',
    { className: authenticated ? 'authed' : 'anon' }
  );
}
```
