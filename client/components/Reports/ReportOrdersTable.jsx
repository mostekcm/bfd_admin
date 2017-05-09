import React, { Component } from 'react';

import {
  Table,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from '../Dashboard';

export default class ReportOrdersTable extends Component {
  static propTypes = {
    orders: React.PropTypes.array.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.orders !== this.props.orders;
  }

  render() {
    const orders = this.props.orders || [];

    return (
      <Table>
        <TableHeader>
          <TableColumn width="10%">Date</TableColumn>
          <TableColumn width="10%">Target Ship Date</TableColumn>
          <TableColumn width="10%">Show</TableColumn>
          <TableColumn width="25%">Store Name</TableColumn>
          <TableColumn width="25%">Store Contact</TableColumn>
          <TableColumn width="20%">Sales Rep</TableColumn>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => {
            return <TableRow key={index}>
              <TableTextCell>{moment.unix(order.date).format('YYYY-MM-DD')}</TableTextCell>
              <TableTextCell>{moment.unix(order.targetShipDate).format('YYYY-MM-DD')}</TableTextCell>
              <TableTextCell>{order.show.name}</TableTextCell>
              <TableTextCell>{order.store.name}</TableTextCell>
              <TableTextCell>{order.store.contact}</TableTextCell>
              <TableTextCell>{order.salesRep.name}</TableTextCell>
            </TableRow>;
          })}
        </TableBody>
      </Table>
    );
  }
}
