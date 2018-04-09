import React, { Component } from 'react';
import { submit } from 'redux-form';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';

import { Error, Confirm } from '../../../components/Dashboard';
import ChooseShowFormDecorator, { ChooseShowFormName } from '../../../components/Reports/ChooseShowForm';

export default connectContainer(class ChooseShowAndYear extends Component {
  constructor(props) {
    super(props);
  }

  static stateToProps = (state) => ({
    ordersForShow: state.ordersForShow,
  });

  static actionsToProps = {
    submit
  };

  static propTypes = {
    ordersForShow: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    submit: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.ordersForShow !== this.props.ordersForShow;
  }

  onSubmit = (formData) => {
    this.props.router.push(`/report/show/${formData.show}/${formData.year}`);
  };

  onConfirm = () => {
    this.props.submit(ChooseShowFormName);
  };

  render() {
    const { error, loading, year, show } = this.props.ordersForShow.toJS();

    const initialValues = { year, show };
    const ChooseShowForm = ChooseShowFormDecorator(this.onSubmit.bind(this));
    return (
      <Confirm title="Choose Show and Year" show={!year || !show} loading={loading} onCancel={this.onConfirm}
               onConfirm={this.onConfirm} dialogClassName={'choose-show-and-form'}>
        <Error message={error}/>
        <ChooseShowForm initialValues={initialValues} />
      </Confirm>
    );
  }
});
