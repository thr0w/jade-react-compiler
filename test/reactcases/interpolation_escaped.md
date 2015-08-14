```jade
- var title = "On Dogs: Man's Best Friend";
- var author = "enlore";
- var theGreat = "<span>escape!</span>";
div
  h1= title
  p Written with love by #{author}
  p This will be safe: #{theGreat}
```
```javascript
function src(){
  var title = "On Dogs: Man's Best Friend";
  var author = "enlore";
  var theGreat = "<span>escape!</span>";
  return React.createElement('div', null,
    React.createElement('h1', null, title),
    React.createElement('p', null, 'Written with love by ',author),
    React.createElement('p', null, 'This will be safe: ',theGreat)
  );
}
```
