import React, { Component } from 'react';
import { Field } from 'redux-form';
import classNames from 'classnames';

class ComboField extends Component {

  render() {
    const { label, name, options, validationErrors } = this.props;
    const classes = classNames({
      'form-group': true,
      'has-error': validationErrors && validationErrors[name] && validationErrors[name].length
    });

    return (
      <div className={classes}>
        <label>{label}</label>
        <Field name = {name} component="select" className="form-control" {...this.props.props} onChange={this.onChange}>
          {options.length > 1 && <option value=""></option>}
          {options.map((option, index) => {
            return <option key={index} value={option.value}>{option.text}</option>;
          })}
        </Field>
        {validationErrors && validationErrors[name] && validationErrors[name].length && <div className="help-block">{validationErrors[name][0]}</div>}
      </div>
    );
  }
}

ComboField.propTypes = {
  props: React.PropTypes.object,
  options: React.PropTypes.array.isRequired,
  name: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  validationErrors: React.PropTypes.object
};

export default ComboField;
