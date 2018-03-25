import './patchLanguage';
import dva from 'dva';
import createLogger from 'redux-logger';
import './index.html';
import './index.less';
// 1. Initialize
const app = dva();

// 2. Plugins
const logger = createLogger({
  level: 'info',
  collapsed: false,
  logger: console,
  predicate: (getState, action) => true,
});

const portalReducers = (state = {}, action) => {
  if (action.type.substr(0, 7) === 'portal/') {
    return Object.assign({}, state, { [action.type.substr(7)]: action.dataMap(action.payload) })
  }
  return state;
}

app.use({ extraReducers: { portal: portalReducers } });

// 3. Model
app.model(require('./models/api'));
app.model(require('./models/activity'));
app.model(require('./models/authentication'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
