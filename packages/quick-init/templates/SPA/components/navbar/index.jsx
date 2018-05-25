import './style/index.less';

import React from 'react';
import { Icon, Badge, Dropdown, Menu, Modal } from 'antd';
import { version } from '../../../package.json';
import request from './request';
import {history} from 'ufec';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    collapsed: this.props.collapsed,
    visible: false,
    totalAlertCount: 0,
    alertList: {}
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return prevState.collapsed !== nextProps.collapsed ? nextProps : null;
  }

  onClick() {
    this.props.onClick && this.props.onClick();
  }

  onClickHelpList = ({ item, key, keyPath }) => {
    switch(key) {
      case 'about_production':
        this.setState({
          visible: !this.state.visible
        });
        break;
      default:
        break;
    }
  }

  onCancel = () => {
    this.setState({
      visible: false
    });
  }

  render() {
    const state = this.state;
    const __ = this.props.__;
    const alertMenu = (
      <Menu onClick={this.onClickAlertList}>
        <Menu.Item key={0}>{__.message}&nbsp;
          <Badge
            count={5}
            style={{ backgroundColor: 'red' }}
          />
        </Menu.Item>
      </Menu>
    );
    const helpMenu = (
      <Menu onClick={this.onClickHelpList}>
        <Menu.Item key="api_doc">{__.api_doc}</Menu.Item>
        <Menu.Item key="about_production">{__.about_production}</Menu.Item>
      </Menu>
    );
    const userMenu = (
      <Menu>
        <Menu.Item>{__.en}</Menu.Item>
        <Menu.Item><a href="/logout">{__.logout}</a></Menu.Item>
      </Menu>
    );
    return (
      <div id="navbar_dropdown_wrapper" className="garen-com-navbar">
        <ul className="left">
          <li className="toggle" onClick={this.onClick.bind(this)}>
            <Icon type={
              state.collapsed ? 'menu-unfold' : 'menu-fold'
            } />
          </li>
        </ul>
        <ul className="right">
          <Dropdown getPopupContainer={() => document.getElementById('navbar_dropdown_wrapper')} overlay={alertMenu} >
            <li>
              <Badge count={state.totalAlertCount} overflowCount={99}>
                <div className="alert">
                  <Icon type="alarm" />
                </div>
              </Badge>
            </li>
          </Dropdown>
          <Dropdown getPopupContainer={() => document.getElementById('navbar_dropdown_wrapper')} overlay={helpMenu} >
            <li>
              <Icon type="exclamation-circle" /> {__.help}
            </li>
          </Dropdown>
          <Dropdown getPopupContainer={() => document.getElementById('navbar_dropdown_wrapper')} overlay={userMenu} >
            <li>
              <Icon type="admin" /> {GAREN.user.username}<Icon type="caret-down-right" />
            </li>
          </Dropdown>
        </ul>
        {/* 关于产品pop */}
        <Modal
          title={__.about_production}
          visible={state.visible}
          footer={null}
          onCancel={this.onCancel}
        >
          <div className="about_production_content">

          </div>
        </Modal>
      </div>
    );
  }
}

module.exports = NavBar;
