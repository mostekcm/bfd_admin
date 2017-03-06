import { reduxForm } from 'redux-form';

export default function createForm(name, component) {
  let fields = component.formFields;
  return reduxForm({ form: name, fields: fields, enableReinitialize: true })(component);
}
