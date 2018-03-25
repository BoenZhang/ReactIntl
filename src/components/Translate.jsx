import {LocaleProvider} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import React, {Component, PropTypes} from 'react';

const languageMap = {
  'en': enUS,
  'cn': {},
}

export const antTranlateWrappedComponent = (Wrapped) => {
  return class extends Component {

    getChildContext() {
      return {language: localStorage.getItem('language')};
    }

    static childContextTypes = {
      language: PropTypes.string,
    };

    render() {
      return (
        <LocaleProvider locale={languageMap[localStorage.getItem('language')]}>
          <Wrapped {...this.props}/>
        </LocaleProvider>
      )
    }
  }
}
