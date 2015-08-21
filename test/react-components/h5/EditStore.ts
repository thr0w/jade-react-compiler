export var EditStore = function(){
   return {
     name: {
       labelText: "Name",
       hintText: "Write your name",
       type: "text",
       disabled: false,
       value: "",
       errorText: null,
     },
     focus: false,
     autofocus: false,
   }
}()
