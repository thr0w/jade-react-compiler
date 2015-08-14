```jade
- var user = { description: 'foo bar baz' }
- var authorised = false
#user
  if user.description
    h2 Description
    p.description= user.description
  else if authorised
    h2 Description
    p.description.
      User has no description,
      why not add one...
  else
    h1 Description
    p.description User has no description
```
```javascript
function src(){
  var user = { description: 'foo bar baz' };
  var authorised = false;
  return React.createElement('div', { id: 'user' },
    (function(){ var $ret = [];
      if (user.description) {
         $ret.push(React.createElement('h2', null, 'Description'));
         $ret.push(React.createElement('p', { className: 'description' }, user.description));
      } else if (authorised) {
         $ret.push(React.createElement('h2', null, 'Description'));
         $ret.push(React.createElement('p', { className: 'description' }, 'User has no description,',   'why not add one...'));
     } else {
         $ret.push(React.createElement('h1', null, 'Description'));
         $ret.push(React.createElement('p', { className: 'description' }, 'User has no description'));
     }
     return $ret;
   })()
  );
}
```
