import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { loadCredentials } from '../actions';
import { LoadingPanel, Error } from '../../components/Dashboard';

class LoginContainer extends Component {
  static propTypes = {
    loadCredentials: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.auth !== this.props.auth;
  }

  componentWillMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.router.push(this.props.auth.returnTo);
    } else if (!this.props.auth.isAuthenticating) {
      this.props.loadCredentials(this.props.location);
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-12 wrapper">
          <LoadingPanel show={this.props.auth.isAuthenticating}>
            <div className="row">
              <div className="col-xs-12 wrapper">
                <Error message={ this.props.auth.error }/>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 wrapper">
                Logging in...
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
    auth: state.auth.toJS()
  };
}

export default connect(mapStateToProps, { loadCredentials })(LoginContainer);
