```jade
div
  unless user.isAnonymous
    p You're logged in as #{user.name}
```
```javascript
function src(){
  return React.createElement('div', null,
    (function(){ var $ret = [];
      if (!user.isAnonymous) {
         $ret.push(React.createElement('p', null, "You're logged in as ", user.name));
      }
      return $ret;
   })()
  );
}
```
