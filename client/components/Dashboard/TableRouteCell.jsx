import React, { Component } from 'react';
import { Link } from 'react-router';

class TableRouteCell extends Component {
  render() {
    let { target } = this.props;

    target = target || '';

    return (
      <td className="truncate" title={this.props.children}>
        <Link to={`${this.props.route}`} target={target}>
          {this.props.children}
        </Link>
      </td>);
  }
}

TableRouteCell.propTypes = {
  route: React.PropTypes.string.isRequired,
  target: React.PropTypes.string
};

export default TableRouteCell;
