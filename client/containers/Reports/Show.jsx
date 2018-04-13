import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Button } from 'react-bootstrap';
import formatCurrency from 'format-currency';

import { fetchShowOrders, resetShowOrders } from '../../actions/order';

import ChooseShowAndYearDialog from './Dialogs/ChooseShowAndYear';

import { Error, LoadingPanel } from '../../components/Dashboard';
import OrderDetailsTable from '../../components/Orders/OrderDetailsTable';
import OrderDisplayDetailsTable from '../../components/Orders/OrderDisplayDetailsTable';
import OrderStoreInfo from '../../components/orders/OrderStoreInfo';

export default connectContainer(class ShowReport extends Component {
  static stateToProps = (state) => ({
    ordersForShow: state.ordersForShow.toJS(),
  });

  static actionsToProps = {
    fetchShowOrders,
    resetShowOrders
  };

  static propTypes = {
    ordersForShow: PropTypes.object,
    params: PropTypes.object,
    fetchShowOrders: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
  };

  componentWillMount() {

    if (this.props.params.show && this.props.params.year) {
      this.props.fetchShowOrders(this.props.params.show, this.props.params.year);
    }
  };

  shouldComponentUpdate(nextProps) {

    return nextProps.ordersForShow !== this.props.ordersForShow ||
      nextProps.params !== this.props.params;
  }

  componentDidUpdate(prevProps) {

    if (prevProps.params !== this.props.params) {
      if (this.props.params.show && this.props.params.year) {
        this.props.fetchShowOrders(this.props.params.show, this.props.params.year);
      } else {
        this.props.resetShowOrders(this.props.params.show, this.props.params.year)
      }
    }
  }

  getNewShow() {
    this.props.router.push('/report/show')
  }

  render() {
    const { loading, error, records, show, year } = this.props.ordersForShow;
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
              <Button onClick={this.getNewShow.bind(this)}>
                Choose a Different Report
              </Button>
            </div>
          </div>
          <h1>{show} {year}</h1>
          {records.map((order, index) => {
              const maxCommissionInfo = _.find(order.totals.commissionInfo, info => info.payee === 'max');
              const commission = maxCommissionInfo.paid + maxCommissionInfo.due;
              const month = moment.unix(order.dueDate).format("MM/YYYY");
              if (!paymentSchedule[month]) paymentSchedule[month] = { base: 0.0, commission: 0.0 };
            paymentSchedule[month].commission += commission;
            paymentSchedule[month].base += order.totals.commissionBase;
              return <div key={index}>
                <hr style={hrStyle}/>
                <div className="row">
                  <div className="col-xs-6 col-md-6">
                    <div className="inline">INVOICE NUMBER: {order.invoiceNumber}</div>
                    ORDER DATE: {moment.unix(order.date).format('MM/DD/YYYY')}
                    {order.dueDate ?
                      <div className="inline">TARGET COMMISSION PAY
                        DATE: {moment.unix(order.dueDate).format('MM/DD/YYYY')}</div> : ''}
                  </div>
                  <div className="col-xs-6 col-md-6">
                    <OrderStoreInfo store={order.store}/>
                  </div>
                  <div className="row">
                    <div className="col-xs-12">
                      <h3>Products</h3>
                      <OrderDetailsTable lineItems={order.lineItems}/>
                    </div>
                  </div>
                  {order.displayItems.length > 0 ?
                    <div className="row">
                      <div className="col-xs-12">
                        <h3>Displays</h3>
                        <OrderDisplayDetailsTable displayItems={order.displayItems}/>
                      </div>
                    </div> : ''}
                  <div className="row">
                    <div className="col-xs-6 col-md-6">
                      TOTAL COMMISSION BASE: {formatCurrency(order.totals.commissionBase, opts)} <br/>
                      TOTAL COMMISSION: {formatCurrency(commission, opts)}
                    </div>
                  </div>
                </div>
              </div>;
            }
          )}
          <div className={'row'}>
            <div className={'col-xs-12'}>
              <hr style={hrStyle}/>
              <h2>Estimated Payment Schedule</h2>
              {
                Object.keys(paymentSchedule).map((month, index) =>
                  <div key={index}>
                    {month}: base: {formatCurrency(paymentSchedule[month].base, opts)}, commission: {formatCurrency(paymentSchedule[month].commission, opts)}<br/>
                  </div>)
              }
            </div>
          </div>
        </LoadingPanel>
      </div>
    );

  }
});
