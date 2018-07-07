import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';

export default connectContainer(class Order extends Component {
  render() {
    const range = [...Array(1000).keys()];
    return (
      <div className={"row"}>
        { range.map((na, key) =>
          <div classname={"col-xs-2 col-sm-1"} key={key}>
            <i className={`icon-budicon-${key}`}></i>
            {key}
          </div>
        )}
      </div>
    );

  }
});
