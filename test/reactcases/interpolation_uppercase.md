```jade
- var msg: string = "not my inside voice";
p This is #{msg.toUpperCase()}
```
```javascript
function src(msg: string){
  return React.createElement('p', null,
    'This is ', msg.toUpperCase()
  );
}
```
