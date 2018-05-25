import './style/index.less';

import ReactDOM from 'react-dom';
import React from 'react';
import Model from './model';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_US from 'antd/lib/locale-provider/en_US';
import { LocaleProvider } from 'antd';
import { Router } from 'react-router-dom';
import __  from 'client/locale/dashboard.lang.json';
import {history} from 'ufec';

const lang = GAREN.locale === 'zh-cn' ? zh_CN : en_US;

ReactDOM.render(
  <Router history={history}>
    <LocaleProvider locale={lang}>
      <Model __={__} />
    </LocaleProvider>
  </Router>,
  document.getElementById('container')
);
