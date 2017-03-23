import React, { Component } from 'react';

import {
  Table,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from '../Dashboard';

export default class ReportLabelsTable extends Component {
  static propTypes = {
    labelTotals: React.PropTypes.array.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.labels !== this.props.labels;
  }

  render() {
    const { labelTotals } = this.props;

    const thisLabelTotals = labelTotals || [];

    return (
      <Table>
        <TableHeader>
          <TableColumn width="80%">Label</TableColumn>
          <TableColumn width="20%">Sheets</TableColumn>
        </TableHeader>
        <TableBody>
          {thisLabelTotals.map((item, index) => {
            return <TableRow key={index}>
              <TableTextCell>{item.labelKey}</TableTextCell>
              <TableTextCell>{item.sheets}</TableTextCell>
            </TableRow>;
          })}
        </TableBody>
      </Table>
    );
  }
}
