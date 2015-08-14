```jade
div
  div(escaped="<code>")
  div(unescaped!="<code>")
```
```javascript
function src(){
  return React.createElement('div', null, 
    React.createElement('div', { escaped: '<code>'}),
    React.createElement('div', { unescaped: '<code>'})
  );
}  
```
