import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { authorizeHubSpot } from '../actions';
import { LoadingPanel, Error } from '../../components/Dashboard';

class AuthorizeCrm extends Component {
  static propTypes = {
    hubSpot: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.hubSpot !== this.props.hubSpot;
  }

  componentWillMount() {
    const returnTo = this.props.location.query && this.props.location.query.returnTo ? this.props.location.query.returnTo : '/orders';
    this.props.authorizeHubSpot(returnTo);
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-12 wrapper">
          <LoadingPanel show={this.props.hubSpot.loading}>
            <div className="row">
              <div className="col-xs-12 wrapper">
                <Error message={ this.props.hubSpot.error }/>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 wrapper">
                Redirecting to HubSpot...
              </div>
            </div>
          </LoadingPanel>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    hubSpot: state.hubSpot.toJS()
  };
}

export default connect(mapStateToProps, { authorizeHubSpot })(AuthorizeCrm);
