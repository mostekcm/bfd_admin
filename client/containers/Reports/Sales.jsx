import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Button } from 'react-bootstrap';
import formatCurrency from 'format-currency';

import { fetchSalesReport } from '../../actions/report';

import ChooseShowAndYearDialog from './Dialogs/ChooseShowAndYear';

import { Error, LoadingPanel } from '../../components/Dashboard';
import OrderDetailsTable from '../../components/Orders/OrderDetailsTable';
import OrderDisplayDetailsTable from '../../components/Orders/OrderDisplayDetailsTable';
import OrderStoreInfo from '../../components/Orders/OrderStoreInfo';

export default connectContainer(class ShowReport extends Component {
  static stateToProps = (state) => ({
    reportState: state.salesReport.report.toJS(),
  });

  static actionsToProps = {
    fetchSalesReport
  };

  static propTypes = {
    query: PropTypes.object,
    report: PropTypes.object,
    fetchSalesReport: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
  };

  fetchReport() {
    if (this.props.query) {
      this.props.fetchSalesReport(this.props.query);
    }
  }

  componentWillMount() {
    this.fetchReport();
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.ordersForShow !== this.props.ordersForShow ||
      nextProps.params !== this.props.params;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query && this.props.query) {
      this.props.fetchSalesReport(this.props.query);
    }
  }

  getNewReport() {
    this.props.router.push('/report/sales')
  }

  render() {
    const { loading, error, report } = this.props.reportState;
    const opts = { format: '%s%v', symbol: '$' };

    const hrStyle = {
      height: '2px',
      'background-color': '#555',
      'margin-top': '20px',
      'margin-bottom': '20px',
      width: '95%'
    };

    const paymentSchedule = {};

    return (
      <div className="order">
        <ChooseShowAndYearDialog router={this.props.router}/>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 col-md-6 wrapper">
              <Error message={error}/>
            </div>
            <div className={"col-xs-12 col-md-6 pull-right"}>
              <Button onClick={this.getNewReport.bind(this)}>
                Choose a Different Report
              </Button>
            </div>
          </div>
          <h1>Monthly for Year</h1>
          {}
        </LoadingPanel>
      </div>
    );

  }
});
