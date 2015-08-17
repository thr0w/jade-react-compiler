```jade
- var customers: {name: string, phone: string}[]
ul
  each customer in customers
    li(onClick= function(e){clickHandle(customer)})
      span= customer.name
      span= customer.phone
script.
  function clickHandle(customer)
  {
    alert('click')
  }
```
```javascript
 function src(customers) {
     return React.createElement('ul', null, customers.map(function (customer) {
         return React.createElement('li', { onClick: function(e){clickHandle(customer)} }, React.createElement('span', null, customer.name), React.createElement('span', null, customer.phone));
      }));
      function clickHandle(customer) {
          alert('click');
      }
  }

```
