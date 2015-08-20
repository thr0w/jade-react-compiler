```jade
- var title: string = "On Dogs: Man's Best Friend";
- var author: string = "enlore";
- var theGreat: string = "<span>escape!</span>";
div
  h1= title
  p Written with love by #{author}
  p This will be safe: #{theGreat}
```
```javascript
function src(title: string, author: string, theGreat: string){
  return React.createElement('div', null,
    React.createElement('h1', null, title),
    React.createElement('p', null, 'Written with love by ',author),
    React.createElement('p', null, 'This will be safe: ',theGreat)
  );
}
```
