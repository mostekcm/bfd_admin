import React, { Component } from 'react';

import {
  Table,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from '../Dashboard';

export default class ReportSkusTable extends Component {
  static propTypes = {
    skus: React.PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.skus !== this.props.skus;
  }

  render() {
    const { skus } = this.props;

    const skuLineItems = [];

    if (skus) {
      Object.keys(skus).forEach(productName =>
        Object.keys(skus[productName]).forEach(skuSize =>
          Object.keys(skus[productName][skuSize]).forEach(variety =>
            skuLineItems.push({
              productName: productName,
              skuSize: skuSize,
              variety: variety,
              quantity: skus[productName][skuSize][variety].quantity,
              testerQuantity: skus[productName][skuSize][variety].testerQuantity,
            }))));
    }

    return (
      <Table>
        <TableHeader>
          <TableColumn width="35%">Product</TableColumn>
          <TableColumn width="20%">Unit Size</TableColumn>
          <TableColumn width="25%">Variety</TableColumn>
          <TableColumn width="10%">Quantity</TableColumn>
          <TableColumn width="10%"># Testers</TableColumn>
        </TableHeader>
        <TableBody>
          {skuLineItems.map((item, index) => {
            return <TableRow key={index}>
              <TableTextCell>{item.productName}</TableTextCell>
              <TableTextCell>{item.skuSize}</TableTextCell>
              <TableTextCell>{item.variety}</TableTextCell>
              <TableTextCell>{item.quantity}</TableTextCell>
              <TableTextCell>{item.testerQuantity}</TableTextCell>
            </TableRow>;
          })}
        </TableBody>
      </Table>
    );
  }
}
