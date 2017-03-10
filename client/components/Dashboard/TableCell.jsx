import { PropTypes, Component } from 'react';

class TableCell extends Component {
  static propTypes = {
    rowSpan: PropTypes.number
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.children !== this.props.children;
  }

  render() {
    const rowSpan = this.props.rowSpan || 1;
    return <td className="truncate" rowSpan={rowSpan}>
        { this.props.children }
      </td>;
  }
}

export default TableCell;
