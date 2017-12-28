import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

import { reportActions } from '../../actions';

import DownloadCsvDialog from './Dialogs/DownloadCsvDialog';
import ShipmentForm from '../../components/Reports/ShipmentForm';

export default connectContainer(class Shipments extends Component {
  static stateToProps = (state) => ({
    shipmentsReport: state.shipmentsReport,
  });

  static actionsToProps = {
    ...reportActions
  };

  static propTypes = {
    shipmentsReport: PropTypes.array,
    fetchShipmentsByDate: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.form = null;
  }

  componentWillMount() {
    this.props.requestShipmentsForm();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.shipmentsReport !== this.props.shipmentsReport;
  }

  openDownloadCsvDialog = (shipmentFields) => {
    this.props.fetchShipmentsByDate(shipmentFields.startDate);
  }

  onDownloadRequest() {
    if (this.form) {
      try {
        this.form.submit();
      } catch(err) {
        console.error("error submitting request for csv: ", err.message);
      }
    }
  }

  render() {
    const { loading, error, record } = this.props.shipmentsReport.toJS();

    return (
      <div className="order">
        <div className="row">
          <div className="col-xs-12 order-table-content">
            <h1>Shipments</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 order-table-content">
            <ShipmentForm
              ref={formInstance => this.form = formInstance}
              onSubmit={this.openDownloadCsvDialog.bind(this)}/>
          </div>
        </div>
        <div className="row">
          <button className="btn btn-success" onClick={this.onDownloadRequest.bind(this)}>Download CSV</button>
        </div>
        <DownloadCsvDialog
          data={record}
          loading={loading}
          error={error}
        />
      </div>
    );

  }
});
