```jade
// - require('./input.less');

- property store: EditStore
- property field: string
- property rowSpan: number = 1
- property colSpan: number = 1

- var meta: EditStoreField = store[field]

td(
  class= 'h_input_td',
  colSpan= colSpan,
  rowSpan=rowSpan,
  onTouchTap= focusHandler)

  label(
    class = {
      h_Input_LabelComValue: has_focus() || has_value(),
      h_Input_LabelSemValue: !(has_focus() || has_value()),
      focus: has_focus() && !has_error(),
      erro: has_error(),
    })= meta.labelText

  if !has_value() && has_focus()
    label(
         class={
           h_Input_LabelSemValue: true,
           erro: has_error()
         }
      )= meta.hintText

  input(
      name = field,
      type = meta.type,
      value = meta.value,
      title = field.disabled || field.hintText,
      hintText = meta.hintText,
      errorText = meta.error
      class = 'h_input',
      ref = 'h_input_' + field,
      autoFocus = store.autofocus == field,
      disabled= meta.disabled,
      onFocus = focusHandler,
      onChange = changeHandler,
      onBlur = blurHandler  
    )

  hr(class={
      h_input_hr: true,
      h_input_hr_error: has_error()
    })

  if (has_focus())
    hr(class={
      h_input_hr_focus : true,
      h_input_hr_focus_error: has_error()
    })

  if (has_error())
    span(class= 'h_input_labelError')= meta.errorText


script.

  function changeHandler(ev) {
    meta.value = ev.target.value;
    this.setState({});
  }

  function focusHandler(e) {
    store.focus = meta;
    this.setState({});
  }

  function blurHandler(ev) {
    if (store.focus == meta)
      store.focus=null;
    meta.value = ev.target.value;
    meta.validate()
    this.setState({
    });
  }

  function has_focus(){
    return store.focus == meta
  }
  function has_error(){
    return !!meta.errorText
  }

  function has_value(){
    return !!meta.value
  }

```
```javascript
import {
    createClass,
    createElement
} from 'react';
require('./input.less');
var Input = (function () {
    var store: EditStore, field: string, rowSpan: number, colSpan: number, meta: EditStoreField;
    return createClass({
        displayName: 'Input',
        render: function () {
            var _this=this;
            return createElement('td', {
                colSpan: colSpan,
                rowSpan: rowSpan,
                onTouchTap: focusHandler,
                className: 'h_input_td'
            }, function () {
                var $ret = [];
                $ret.push(createElement('label', {
                    className: [
                        has_focus() || has_value() ? 'h_Input_LabelComValue' : '',
                        !(has_focus() || has_value()) ? 'h_Input_LabelSemValue' : '',
                        has_focus() && !has_error() ? 'focus' : '',
                        has_error() ? 'erro' : ''
                    ].join(' ')
                }, meta.labelText));
                if (!has_value() && has_focus()) {
                    $ret.push(createElement('label', {
                        className: [
                            true ? 'h_Input_LabelSemValue' : '',
                            has_error() ? 'erro' : ''
                        ].join(' ')
                    }, meta.hintText));
                }
                $ret.push(createElement('input', {
                    name: field,
                    type: meta.type,
                    value: meta.value,
                    title: field.disabled || field.hintText,
                    hintText: meta.hintText,
                    errorText: meta.error,
                    ref: 'h_input_' + field,
                    autoFocus: store.autofocus == field,
                    disabled: meta.disabled,
                    onFocus: focusHandler,
                    onChange: changeHandler,
                    onBlur: blurHandler,
                    className: 'h_input'
                }));
                $ret.push(createElement('hr', {
                    className: [
                        true ? 'h_input_hr' : '',
                        has_error() ? 'h_input_hr_error' : ''
                    ].join(' ')
                }));
                if (has_focus()) {
                    $ret.push(createElement('hr', {
                        className: [
                            true ? 'h_input_hr_focus' : '',
                            has_error() ? 'h_input_hr_focus_error' : ''
                        ].join(' ')
                    }));
                }
                if (has_error()) {
                    $ret.push(createElement('span', { className: 'h_input_labelError' }, meta.errorText));
                }
                return $ret;
            }());
            function changeHandler(ev) {
                meta.value = ev.target.value;
                _this.setState({});
            }
            function focusHandler(e) {
                store.focus = meta;
                _this.setState({});
            }
            function blurHandler(ev) {
                if (store.focus == meta)
                    store.focus = null;
                meta.value = ev.target.value;
                meta.validate();
                _this.setState({});
            }
            function has_focus() {
                return store.focus == meta;
            }
            function has_error() {
                return !!meta.errorText;
            }
            function has_value() {
                return !!meta.value;
            }
        },
        componentWillMount: function () {
            store = this.props.store;
            field = this.props.field;
            rowSpan = this.props.rowSpan || 1;
            colSpan = this.props.colSpan || 1;
            meta = store[field];
        }
    });
})();
module.exports = Input;

```
