import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { Tabs, Tab } from 'react-bootstrap';

import { orderActions } from '../../actions';

import './Order.css';

import * as dialogs from './Dialogs';
import { OrderActions/*, OrderHeader, OrderProfile, OrderLogs, OrderInfo*/ } from '../../components/Orders';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    order: state.order
  });

  static actionsToProps = {
    ...orderActions
  }

  static propTypes = {
    order: PropTypes.object,
    params: PropTypes.object,
    fetchOrder: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchOrder(this.props.params.id);
  }

  render() {
    const { order } = this.props;
    return (
      <div className="order">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="pull-left">Order Details</h2>
            <div className="pull-right">
              <OrderActions
                order={order}
                deleteOrder={this.props.requestDeleteOrder}
              />
            </div>
          </div>
        </div>
      </div>
      );
      //   <!-- div className="row">
      //     <div className="col-xs-12">
      //       <OrderHeader loading={order.get('loading')} order={order.get('record')} error={order.get('error')} />
      //     </div>
      //   </div>
      //   <div className="row order-tabs">
      //     <div className="col-xs-12">
      //       <Tabs defaultActiveKey={1} animation={false} id="order-info-tabs">
      //         <Tab eventKey={1} title="Order Information">
      //           <OrderInfo loading={order.get('loading')} order={order.get('record')}
      //                     memberships={order.get('memberships').toJSON()} error={order.get('error')} />
      //         </Tab>
      //         <Tab eventKey={2} title="Devices">
      //           <OrderDevices loading={devices.get('loading')} devices={devices.get('records')}
      //                        error={devices.get('error')} />
      //         </Tab>
      //         <Tab eventKey={3} title="Logs">
      //           <LogDialog
      //             onClose={this.props.clearLog} error={log.get('error')}
      //             loading={log.get('loading')} log={log.get('record')}
      //             logId={log.get('logId')}
      //           />
      //           <OrderLogs
      //             onOpen={this.props.fetchLog} loading={logs.get('loading')}
      //             logs={logs.get('records')} order={order.get('record')}
      //             error={logs.get('error')}
      //           />
      //         </Tab>
      //         <Tab eventKey={4} title="Profile">
      //           <OrderProfile loading={order.get('loading')} order={order.get('record')} error={order.get('error')} />
      //         </Tab>
      //       </Tabs>
      //     </div>
      //   </div>
      //   <dialogs.DeleteDialog />
      //   <dialogs.EmailChangeDialog />
      //   <dialogs.PasswordResetDialog />
      //   <dialogs.PasswordChangeDialog />
      //   <dialogs.OrdernameChangeDialog />
      //   <dialogs.ResendVerificationEmailDialog />
      //   <dialogs.BlockDialog />
      //   <dialogs.UnblockDialog />
      //   <dialogs.RemoveMultiFactorDialog / -->
      // </div>
  }
});
