import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Button } from 'react-bootstrap';

import OrdersTable from '../../components/Orders/OrdersTable';
import PackingListTable from '../../components/Orders/PackingListTable';
import { getSimpleLineItems } from '../../utils/getSimpleLineItems';

export default connectContainer(class Order extends Component {
  static stateToProps = (state) => ({});

  static actionsToProps = {};

  static propTypes = {
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  backToOrders() {
    this.props.router.push('/orders');
  }

  render() {
    const { location } = this.props;

    const orders = location.state ? location.state.orders : {};
    const {
      displayLineItems,
      packingLineItems,
      testerLineItems
    } = getSimpleLineItems(_.values(orders));

    return (
      <div className="order">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="pull-left">Order Rollup</h2>
            <div className="pull-right">
              <Button onClick={this.backToOrders.bind(this)}>Back to Orders</Button>
            </div>
          </div>
        </div>
        <div className={"row"}>
          <h3>Orders</h3>
          <div className="col-xs-12">
            <OrdersTable orders={_.values(orders)} loading={false}/>
          </div>
        </div>
        <div className="row">
          <h3>Product (includes Offset Merch)</h3>
          <div className="col-xs-12">
            <PackingListTable lineItems={packingLineItems}/>
          </div>
        </div>
        <div className="row">
          <h3>Displays</h3>
          <div className="col-xs-12">
            <PackingListTable lineItems={displayLineItems}/>
          </div>
        </div>
        <div className="row">
          <h3>Testers</h3>
          <div className="col-xs-12">
            <PackingListTable lineItems={testerLineItems}/>
          </div>
        </div>
      </div>
    );

  }
});
