import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';

import {
  Table,
  TableCell,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from 'auth0-extension-ui';

import './PackingListTable.css';

export default class PackingListTable extends Component {
  static propTypes = {
    lineItems: PropTypes.array.isRequired
  };

  render() {
    const { lineItems } = this.props;

    if (lineItems.length === 0) return <div>None</div>;

    return <div className={'packingList'}>
      <Table>
        <TableHeader>
          <TableColumn width="10%">Packed</TableColumn>
          <TableColumn width="10%">Checked</TableColumn>
          <TableColumn width="40%">Name</TableColumn>
          <TableColumn width="10%">Qty</TableColumn>
        </TableHeader>
        <TableBody>
          {lineItems.map((lineItem, index) => {
            return <TableRow key={index}>
              <TableTextCell><Checkbox/></TableTextCell>
              <TableTextCell><Checkbox/></TableTextCell>
              <TableTextCell>{lineItem.name}</TableTextCell>
              <TableTextCell>{lineItem.quantity}</TableTextCell>
            </TableRow>;
          })}
        </TableBody>
      </Table>
    </div>;
  }
};
