import React, { Component } from 'react';
import PropTypes from 'prop-types';
import formatCurrency from 'format-currency';
import _ from 'lodash';
import moment from 'moment';

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
    orders: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onRowSelect: PropTypes.func
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.orders !== this.props.orders;
  }

  convertStatusToSortOrder(status) {
    const order = {
      blackStatus: 10,
      greyStatus: 6,
      blueStatus: 5,
      beigeStatus: 4,
      greenStatus: 3,
      amberStatus: 2,
      redStatus: 1
    };

    return order[status];
  }

  render() {
    let orders = this.props.orders || [];
    const opts = { format: '%s%v', symbol: '$' };

    orders.forEach((order) => {
      order.shippedStatus = 'greyStatus';
      // beige color#DEB887

      if (!order.shippedDate) {
        order.shippedStatus = 'greenStatus';

        const redBarrier = 0 * 24 * 60 * 60; // 7 days
        const amberBarrier = 14 * 24 * 60 * 60; // 21 days
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
          const redBarrier = 14 * 24 * 60 * 60; // 21 days
          const amberBarrier = 2 * 24 * 60 * 60; // 7 days
          const now = moment().unix();
          const paidDiff = parseInt(now, 10) - parseInt(dueDate, 10);

          if (paidDiff >= redBarrier) order.paidStatus = 'redStatus';
          else if (paidDiff >= amberBarrier) order.paidStatus = 'amberStatus';
          order.dueDateDisplay = moment.unix(dueDate).format('YYYY-MM-DD');
        }
      }

      if (order.dealStage === 'Qualifying') {
        order.paidStatus = 'beigeStatus';
        order.shippedStatus = 'beigeStatus';
      } else if (order.dealStage === 'Pending Approval') {
        order.paidStatus = 'blueStatus';
        order.shippedStatus = 'blueStatus';
      } else if (order.dealStage === 'Closed Lost') {
        order.paidStatus = 'blackStatus';
        order.shippedStatus = 'blackStatus';
      } else if (order.dealStage === 'Closed Won' && order.dueDateDisplay === 'PAID') {
        order.paidStatus = 'greyStatus';
        order.shippedStatus = 'greyStatus';
      }
    });

    orders = _.map(orders, order => ({
      ...order,
      displayShippedDate: order.shippedDate ?
        moment.unix(order.shippedDate).format('YYYY-MM-DD') :
        (!!order.shipAsap ? '?ASAP' : '?HOLD') + (order.targetShipDate ?
        moment.unix(order.targetShipDate).format(`-MM-DD?`) :
        '?')
    }));

    const me = this;
    const tableRowOrders = _.sortBy(orders, [
      o => me.convertStatusToSortOrder(o.shippedStatus),
      o => me.convertStatusToSortOrder(o.paidStatus),
      'displayShippedDate'
    ]);

    return (
      <Table>
        <TableHeader>
          <TableColumn width="2%">&nbsp;</TableColumn>
          <TableColumn width="11%">Invoice #</TableColumn>
          <TableColumn width="4%">Stg</TableColumn>
          <TableColumn width="8%">Order Date</TableColumn>
          <TableColumn width="10%">Ship(ped) Date</TableColumn>
          <TableColumn width="10%">Pay Date</TableColumn>
          <TableColumn width="25%">Store</TableColumn>
          <TableColumn width="9%">Order Total</TableColumn>
          <TableColumn width="9%">Total Due</TableColumn>
        </TableHeader>
        <TableBody>
          {tableRowOrders.map((order, index) => {
            return <TableRow key={index}>
              <TableTextCell><input type={'checkbox'} onChange={(event) => this.props.onRowSelect(order, event.target.checked)}/></TableTextCell>
              <TableRouteCell
                route={`/orders/${order.id}`}>{order.invoiceNumber}</TableRouteCell>
              <TableTextCell>{order.dealStage ? (order.dealStage === 'Closed Lost' ? 'L' : order.dealStage[0]) : '?'}</TableTextCell>
              <TableTextCell>{moment.unix(order.date).format('YYYY-MM-DD')}</TableTextCell>
              <TableTextCell className={order.shippedStatus}>{order.displayShippedDate}</TableTextCell>
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
