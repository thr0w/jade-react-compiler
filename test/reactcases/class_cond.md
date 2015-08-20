```jade
- var authenticated: boolean = true
div(class=authenticated ? 'authed' : 'anon')
```
```javascript
function src(authenticated: boolean){
  return React.createElement('div',
    { className: authenticated ? 'authed' : 'anon' }
  );
}
```
