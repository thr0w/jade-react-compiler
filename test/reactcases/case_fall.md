```jade
- var friends: number = 0
case friends
  when 0
  when 1
    p you have very few friends
  default
    p you have #{friends} friends
```
```javascript
function src(friends: number){
  switch (friends) {
    case 0:
    case 1:
      return React.createElement('p', null, "you have very few friends");
    default:
      return React.createElement('p', null, "you have ", friends,  " friends");
  }
}
```
