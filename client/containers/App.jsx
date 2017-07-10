import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { logout } from '../auth/actions';
import { caseActions, displayActions } from '../actions';

import Header from '../components/Header';

class App extends Component {
  static propTypes = {
    user: PropTypes.object,
    issuer: PropTypes.string,
    logout: PropTypes.func,
    fetchCases: PropTypes.func.isRequired,
    fetchDisplays: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchCases();
    this.props.fetchDisplays();
  }

  render() {
    return (
      <div>
        <Header
          user={this.props.user}
          issuer={this.props.issuer}
          onLogout={this.props.logout}
        />
        <div className="container">
          <div className="row">
            <section className="content-page current">
              <div className="col-xs-12">
                <div id="content-area" className="tab-content">
                  {React.cloneElement(this.props.children)}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    issuer: state.auth.get('issuer'),
    user: state.auth.get('user'),
  };
}

export default connect(select, { logout, ...caseActions, ...displayActions })(App);
