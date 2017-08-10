import React, { Component } from 'react';
import formatCurrency from 'format-currency';

import {
  Table,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from '../Dashboard';

export default class ReportOrderTotalsTable extends Component {
  static propTypes = {
    orders: React.PropTypes.array.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.orders !== this.props.orders;
  }

  render() {
    const opts = { format: '%s%v', symbol: '$' };
    const orders = this.props.orders || [];

    return (
      <Table>
        <TableHeader>
          <TableColumn width="10%">Date</TableColumn>
          <TableColumn width="10%">Paid Date</TableColumn>
          <TableColumn width="12%">Show</TableColumn>
          <TableColumn width="20%">Store</TableColumn>
          <TableColumn width="20%">Store Contact</TableColumn>
          <TableColumn width="10%">Commission Base</TableColumn>
          <TableColumn width="10%">Commission Multiplier</TableColumn>
          <TableColumn width="10%">Commission Due</TableColumn>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => {
            return <TableRow key={index}>
              <TableTextCell>{moment.unix(order.date).format('MM-DD-YYYY')}</TableTextCell>
              <TableTextCell>{moment.unix(order.finalPayment.date).format('MM-DD-YYYY')}</TableTextCell>
              <TableTextCell>{order.show.name}</TableTextCell>
              <TableTextCell>{order.store.name}</TableTextCell>
              <TableTextCell>{order.store.contact}</TableTextCell>
              <TableTextCell>{formatCurrency(order.commissionBase, opts)}</TableTextCell>
              <TableTextCell>{order.commission.multiplier}</TableTextCell>
              <TableTextCell>{formatCurrency(order.commission.due, opts)}</TableTextCell>
            </TableRow>;
          })}
        </TableBody>
      </Table>
    );
  }
}
