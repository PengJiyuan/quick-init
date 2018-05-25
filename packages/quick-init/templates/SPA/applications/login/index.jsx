import './style/index.less';
import ReactDOM from 'react-dom';
import React from 'react';
import Model from './model';
const __ = require('locale/login.lang.json');

const lant = 'en';

ReactDOM.render(<Model __={__} lang={lang}/>, document.getElementById('container'));
