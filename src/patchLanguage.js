import React, {Component, PropTypes} from 'react';
import EN from './languages/trans-EN';

const languageMap = {
  'en': EN,
  'cn': '',
};

class Translate extends Component {
  static contextTypes = {
    language: PropTypes.string
  };

  render() {
    let content = this.props.text;
    if (this.context.language) {
      if (languageMap[this.context.language]) {
        if (/[^\u4e00-\u9fa5]/g.test(content)) {
          content = content.replace(/([\u4e00-\u9fa5]+)/g, (match) => {
            return languageMap[this.context.language][match] ? languageMap[this.context.language][match] : match
          })
        } else {
          languageMap[this.context.language][this.props.text] && (content = languageMap[this.context.language][this.props.text]);
        }
      }
    }
    return <span data-translated>{content}</span>;
  }
}
window.createElement = React.createElement;
createElement = React.createElement;

class InputTrans extends Component {
  static contextTypes = {
    language: PropTypes.string
  };

  render() {
    let props = Object.assign({}, this.props);
    if (this.context.language && props.placeholder) {
      if (languageMap[this.context.language]) {
        if (/[^\u4e00-\u9fa5]/g.test(props.placeholder)) {
          props.placeholder = props.placeholder.replace(/([\u4e00-\u9fa5]+)/g, (match) => {
            return languageMap[this.context.language][match] ? languageMap[this.context.language][match] : match
          })
        } else {
          languageMap[this.context.language][props.placeholder] && (props.placeholder = languageMap[this.context.language][props.placeholder]);
        }
      }
    }
    return <input {...props} ref="input" data-translated onInput={e => {this.value = e.target.value; this.props.onInput && this.props.onInput(e);}}>{this.props.children}</input>
  }

  disguise() {
    const input = this.refs.input;
    for (let key in input) {
      this[key] = input[key];
      if (typeof this[key] === 'function') {
        this[key] = this[key].bind(input);
      }
    }
  }

  componentDidMount() {
    this.disguise();
  }

  componentDidUpdate() {
    this.disguise();
  }
}

React.createElement = (...args) => {
  let children = args.slice(2);

  return createElement(args[0], args[1], ...children);

  children = children.map(child => {
    if (typeof child === 'string') {
      if (args[0] === 'span') {
        if (args[1] && args[1]['data-translated']) {
          return child;
        }
        return createElement(Translate, {text: child});
      }
      return createElement(Translate, {text: child});
    }
    return child;
  });

  if (args[0] == 'input') {
    if (!(args[1] && args[1]['data-translated'])) {
      return createElement(InputTrans, args[1], ...children);
    }
  }

  return createElement(args[0], args[1], ...children);
};
