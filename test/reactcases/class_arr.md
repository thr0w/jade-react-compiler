```jade
ul(a="x", class=['x y',{a:false,b:true},'z'])
```
```javascript
function src(){
  return React.createElement('ul', { a: 'x',
    className: ['x y', false?'a':'', true?'b':'', 'z'].join(' ')
  });
}
```
