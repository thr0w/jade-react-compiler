```jade
p.
  If you take a look at this page's source #[a(target="_blank", href="https://github.com/jadejs/jade/blob/master/docs/views/reference/interpolation.jade") on GitHub],
  you'll see several places where the tag interpolation operator is
  used, like so.
```
```javascript
function src(){
  return React.createElement('p', null,  
      "If you take a look at this page's source ",
      React.createElement('a', {
        target: "_blank",  
        href: "https://github.com/jadejs/jade/blob/master/docs/views/reference/interpolation.jade"
      }, 'on GitHub'),
      ',',
      "you'll see several places where the tag interpolation operator is",
      "used, like so."
  );
}
```
