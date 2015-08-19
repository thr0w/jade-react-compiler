```jade
script.
  import {Customer} from "customer"; // {name: string, phone: string}[]
- var customers: Customer
ul
  each customer in customers
    li(onClick= function(e){clickHandle(customer)})
      span= customer.name
      span= customer.phone
script.
  function clickHandle(customer: Customer)
  {
    alert('click')
  }
```
```javascript

 function src(customers: Customer) {
     return React.createElement('ul', null, customers.map(function (customer) {
         return React.createElement('li', { onClick: function(e){clickHandle(customer)} }, React.createElement('span', null, customer.name), React.createElement('span', null, customer.phone));
      }));
      function clickHandle(customer: Customer) {
          alert('click');
      }
  }

```
