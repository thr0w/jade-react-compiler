```jade
- var a: number, s: string, obj: Namespace.Class
ul
  | #{a} #{s} #{obj.prop}
```
```javascript
function src(a: number, s: string, obj: Namespace.Class){
  return React.createElement('ul', null, a, ' ',s, ' ',obj.prop)
}
```
