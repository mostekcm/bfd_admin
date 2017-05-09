import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { login } from '../actions/auth';
import { LoadingPanel } from '../components/Dashboard';

class LoginContainer extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  }

  componentWillMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.router.push(this.props.location.query.returnTo || '/orders');
    } else if (!this.props.auth.isAuthenticating) {
      this.props.login(this.props.location.query.returnUrl);
    }
  }

  render() {
    if (!this.props.auth.isAuthenticating) {
      return <div></div>;
    }

    return (
      <div className="row">
        <div className="col-xs-12 wrapper">
          <LoadingPanel />
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

export default connect(mapStateToProps, { login })(LoginContainer);
