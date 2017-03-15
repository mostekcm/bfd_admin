import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { reportActions } from '../../actions';

import { Error, LoadingPanel } from '../../components/Dashboard';
import {
  ReportSkusTable, ReportDisplaysTable
} from '../../components/Reports';

export default connectContainer(class ShowReport extends Component {
  static stateToProps = (state) => ({
    showReport: state.showReport,
  });

  static actionsToProps = {
    ...reportActions
  }

  static propTypes = {
    showReport: PropTypes.object,
    params: PropTypes.object,
    fetchShowReport: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchShowReport(this.props.params.name);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.showReport !== this.props.showReport;
  }

  render() {
    const { loading, error, record } = this.props.showReport.toJS();

    console.log("Carlos, show report record: ", record);

    return (
      <div className="order">
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error}/>
            </div>
          </div>
          <div className="row">
            <h2>Skus</h2>
            <div className="col-xs-12">
              <ReportSkusTable skus={record.skus}/>
            </div>
          </div>
          <div className="row">
            <h2>Displays</h2>
            <div className="col-xs-12">
              <ReportDisplaysTable displays={record.displays}/>
            </div>
          </div>
        </LoadingPanel>
      </div>
    );

  }
});
