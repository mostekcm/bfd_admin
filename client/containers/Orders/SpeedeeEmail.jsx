import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Button } from 'react-bootstrap';
import ShippingAddress from '../../components/Orders/ShippingAddress';
import EstimatedShippingWeight from '../../components/Orders/EstimatedShippingWeight';

export default connectContainer(class Order extends Component {
  static stateToProps = (state) => ({
  });

  static actionsToProps = {
  };

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
    const numOrders = Object.keys(orders).length;

    return (
      <div className="order">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="pull-left">Speedee Email</h2>
            <div className="pull-right">
              <Button onClick={this.backToOrders.bind(this)}>Back to Orders</Button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            Hello, this is Beauty Full Day LLC.<br/><br/>
            We have {numOrders} package{numOrders !== 1 ? 's' : ''} to ship.<br/><br/>
            Pickup address for all packages:<br/>
            Beauty Full Day LLC<br/>
            12084 Waconia Cir NE<br/>
            Blaine, MN  55449<br/><br/>
            {Object.keys(orders).map((orderId, index) =>
              <span key={index}>
                Package #{index + 1}:<br/>
                Contents: Household Items<br/>
                <EstimatedShippingWeight label={'Weight'} weight={orders[orderId].totals.weight}/>
                Size: Normal Box<br/>
                Destination:<br/>
                <ShippingAddress store={orders[orderId].store} />
              </span>
              )}<br/>
            You should have our credit card on file for phone number 612-247-6537.  If you need more information, please feel free to call.<br/><br/>
            Delivery instructions: we should be home, so ring the doorbell, but we also will likely have the door ajar with the packages right in the doorway.<br/><br/>
            Thanks!<br/><br/>
            Carlos
          </div>
        </div>
      </div>
    );

  }
});
