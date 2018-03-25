import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import {antTranlateWrappedComponent} from 'components/Translate';


class International extends BasePortal {

  constructor(props) {}

  render() {
    return (
      <div>
        <div>
          <Blocks
            data={this.props.data}
            label={this.props.label}
          />
        </div>
      </div>
    );
  }
}


const WrappedComponent = antTranlateWrappedComponent(International);

export default connect()(WrappedComponent);
