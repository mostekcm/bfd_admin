import React, { Component } from 'react';
import formatCurrency from 'format-currency';

import {
  Table,
  TableCell,
  TableRouteCell,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from '../Dashboard';

export default class OrdersTable extends Component {
  static propTypes = {
    orders: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.orders !== this.props.orders;
  }

  convertStatusToSortOrder(status) {
    const order = {
      greenStatus: 3,
      amberStatus: 2,
      redStatus: 1
    }

    return order[status];
  }

  render() {
    let orders = this.props.orders || [];
    const opts = { format: '%s%v', symbol: '$' };

    orders.forEach((order) => {
      order.shippedStatus = 'greenStatus'
      if (!order.shippedDate) {
        const redBarrier = 7 * 24 * 60 * 60; // 21 days
        const amberBarrier = 21 * 24 * 60 * 60; // 7 days
        const now = moment().unix();
        const shipDiff = order.targetShipDate ? parseInt(order.targetShipDate, 10) - parseInt(now, 10) : 0;

        if (shipDiff <= redBarrier) order.shippedStatus = 'redStatus';
        else if (shipDiff <= amberBarrier) order.shippedStatus = 'amberStatus';
      }

      const dueDate = order.dueDate || order.shippedDate || order.targetShipDate;
      order.dueDateDisplay = 'PAID';
      order.paidStatus = 'greenStatus';
      if (!order.totals.owed <= 0) {
        if (!dueDate) {
          order.dueDateDisplay = '??';
          order.paidStatus = 'redStatus';
        } else {
          const redBarrier = 10 * 24 * 60 * 60; // 21 days
          const amberBarrier = -2 * 24 * 60 * 60; // 7 days
          const now = moment().unix();
          const paidDiff = parseInt(now, 10) - parseInt(dueDate, 10);

          if (paidDiff >= redBarrier) order.paidStatus = 'redStatus';
          else if (paidDiff >= amberBarrier) order.paidStatus = 'amberStatus';
          console.log("carlos: paiddiff: ",paidDiff);
          console.log("carlos: red: ",redBarrier);
          console.log("carlos: amber: ",amberBarrier);
          order.dueDateDisplay = moment.unix(dueDate).format('YYYY-MM-DD');
        }
      }
    });

    const me = this;
    const tableRowOrders = _.sortByAll(orders, [
      o => me.convertStatusToSortOrder(o.shippedStatus),
      o => me.convertStatusToSortOrder(o.paidStatus),
      'date']);

    return (
      <Table>
        <TableHeader>
          <TableColumn width="10%">ID</TableColumn>
          <TableColumn width="10%">Order Date</TableColumn>
          <TableColumn width="10%">Ship(ped) Date</TableColumn>
          <TableColumn width="10%">Payment Due Date</TableColumn>
          <TableColumn width="25%">Store</TableColumn>
          <TableColumn width="10%">Order Total</TableColumn>
          <TableColumn width="10%">Total Due</TableColumn>
        </TableHeader>
        <TableBody>
          { tableRowOrders.map((order, index) => {
            return <TableRow key={index}>
              <TableRouteCell
                route={`/orders/${order.id}`}>{order.id}</TableRouteCell>
              <TableTextCell>{moment.unix(order.date).format('YYYY-MM-DD')}</TableTextCell>
              <TableTextCell className={order.shippedStatus}>{order.shippedDate ? moment.unix(order.shippedDate).format('YYYY-MM-DD') : (order.targetShipDate ? moment.unix(order.targetShipDate).format('?YYYY-MM-DD?') : '??')}</TableTextCell>
              <TableTextCell className={order.paidStatus}>{order.dueDateDisplay}</TableTextCell>
              <TableTextCell>{order.store.name}</TableTextCell>
              <TableTextCell>{formatCurrency(order.totals.total, opts)}</TableTextCell>
              <TableTextCell>{formatCurrency(order.totals.owed, opts)}</TableTextCell>
            </TableRow>;
          })}
        </TableBody>
      </Table>
    );
  }
}
