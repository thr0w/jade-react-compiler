```jade
div
  input(type='checkbox', checked)
  input(type='checkbox', checked=true)
  input(type='checkbox', checked=false)
  input(type='checkbox', checked=true.toString())
```
```javascript
function src(){
  return React.createElement('div', null,
    React.createElement('input', { type: 'checkbox', checked: true}),
    React.createElement('input', { type: 'checkbox', checked: true}),
    React.createElement('input', { type: 'checkbox', checked: false}),
    React.createElement('input', { type: 'checkbox', checked: true.toString()})
  );
}  
```
