```jade
mixin article(title)
  .article
    .article-wrapper
      h1= title
      if block
        block
      else
        p No content provided
div
  +article('Hello world')
  +article('Hello world')
    p This is my
    p Amazing article
```
```pending
```
```javascript

  1 | function src() {
  2 |     function article($ret, title, $block) {
  3 |         $ret.push(React.createElement('div', { className: 'article' }, React.createElement('div', { className: 'article-wrapper' }, function () {
  4 |             var $ret = [];
  5 |             $ret.push(React.createElement('h1', null, title));
  6 |             if (block) {
  7 |                 $ret.push($block);
  8 |             } else {
  9 |                 $ret.push(React.createElement('p', null, 'No content provided'));
 10 |             }
 11 |             return $ret;
 12 |         }())));
 13 |     }
 14 |     return React.createElement('div', null, function () {
 15 |         var $ret = [];
 16 |         article($ret, 'Hello world');
 17 |         article($ret, 'Hello world', [
 18 |             React.createElement('p', null, 'This is my'),
 19 |             React.createElement('p', null, 'Amazing article')
 20 |         ]);
 21 |         return $ret;
 22 |     }());
 23 | }


```
