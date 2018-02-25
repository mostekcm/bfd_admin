import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export default function RequireAuthentication(InnerComponent) {
  class RequireAuthenticationContainer extends React.Component {
    static propTypes = {
      auth: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      router: PropTypes.object.isRequired
    }

    componentWillMount() {
      this.requireAuthentication();
    }

    componentWillReceiveProps() {
      this.requireAuthentication();
    }

    requireAuthentication() {
      if (!this.props.auth.isAuthenticated && !this.props.auth.isAuthenticating) {
        if (!this.props.location) {
          this.props.router.push('/login');
        } else {
          const returnTo = encodeURIComponent(this.props.location.pathname + (this.props.location.search ? this.props.location.search : ''));
          this.props.router.push(`/login?returnUrl=${returnTo}`);
        }
      }
    }

    render() {
      if (this.props.auth.isAuthenticated) {
        return <InnerComponent {...this.props} />;
      }

      return <div></div>;
    }
  }

  return connect((state) => ({ auth: state.auth.toJS() }), {})(RequireAuthenticationContainer);
}
