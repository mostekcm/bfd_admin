import React, { Component } from 'react';

import {
  Table,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from '../Dashboard';

export default class ReportLabelsToPrintTable extends Component {
  static propTypes = {
    labelsToPrint: React.PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.labelsToPrint !== this.props.labelsToPrint;
  }

  render() {
    const { labelsToPrint } = this.props;

    const thisLabelsToPrint = labelsToPrint || [];

    return (
      <Table>
        <TableHeader>
          <TableColumn width="40%">Label</TableColumn>
          <TableColumn width="40%">Product</TableColumn>
          <TableColumn width="20%">Sheets</TableColumn>
        </TableHeader>
        <TableBody>
          {thisLabelsToPrint.map((item, index) => {
            return <TableRow key={index}>
              <TableTextCell>{item.labelKey}</TableTextCell>
              <TableTextCell>{item.productKey}</TableTextCell>
              <TableTextCell>{item.sheets}</TableTextCell>
            </TableRow>;
          })}
        </TableBody>
        </Table>
    );
  }
}
