```jade
doctype html
div
  input(type='checkbox', checked)
  input(type='checkbox', checked=true)
  input(type='checkbox', checked=false)
  input(type='checkbox', checked=true.toString())
```
```error
Don't use doctype with React
```
