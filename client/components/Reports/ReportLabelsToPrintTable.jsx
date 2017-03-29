import React, { Component } from 'react';

import {
  Table,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRouteCell,
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
          <TableColumn width="40%">Product</TableColumn>
          <TableColumn width="40%">Label</TableColumn>
          <TableColumn width="20%">Sheets</TableColumn>
        </TableHeader>
        <TableBody>
          {thisLabelsToPrint.map((item, index) => {
            return <TableRow key={index}>
                {
                  (item.pdf && item.pdf.length > 0) ?
                  <TableRouteCell target="_blank" route={item.pdf} >{item.productKey}</TableRouteCell>
                  :
                  <TableTextCell>{item.productKey}</TableTextCell>
                }
              <TableTextCell>{item.labelKey}</TableTextCell>
              <TableTextCell>{item.sheets}</TableTextCell>
            </TableRow>;
          })}
        </TableBody>
        </Table>
    );
  }
}
