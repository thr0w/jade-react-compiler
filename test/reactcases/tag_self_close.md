```jade
div
  Foo/
  foo(bar='baz')/
```
```javascript
function src(){
  return React.createElement('div', null,
    React.createElement(Foo),
    React.createElement('foo', {bar: 'baz'})
  );
}
```
