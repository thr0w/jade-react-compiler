```jade
- var values: string[] = [];
ul
  each val in values.length ? values : ['There are no values']
    li= val
```
```javascript
function src(values: string[]) {
  return React.createElement('ul', null,
    (values.length ? values : ['There are no values']).map(function(val) {
       return React.createElement('li', null, val)
    })
  );
}
```
