import React from 'react';
import request from './request';

class Model extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      usernameEmptyError: false,
      passwordEmptyError: false,
      isSubmitting: false,
      visible: false,
      errorinfo: '',
      errorOccur: false
    };

    ['onClick', 'toggoleVisibility', 'getFocus'].forEach(item => this[item] = this[item].bind(this));
  }

  onClick(e){
    e.preventDefault();

    if (this.state.isSubmitting) {
      return;
    }

    let __ = this.props.__,
      username = this.username.value,
      password = this.password.value,
      data = {username, password};


    this.setState({
      usernameEmptyError: false,
      passwordEmptyError: false,
      isSubmitting: false,
      visible: false,
      errorinfo: '',
      errorOccur: false
    });

    if(!username){
      this.setState({
        usernameEmptyError: true
      });
    }
    if(!password){
      this.setState({
        passwordEmptyError: true
      });
    }
    if(!username || !password){
      return;
    }

    this.setState({
      isSubmitting: true
    });

    request.login(data).then(response => {
      window.location = window.location.pathname;
    }).catch(err => {
      let code = err.status,
        error;
      if(code === 500){
        error = __.unknown_error;
      } else {
        error = __.error_tip;
      }
      this.setState({
        errorOccur: true,
        errorinfo: error,
        isSubmitting: false
      });
    });

  }

  toggoleVisibility(e){
    let visible = this.state.visible;
    this.setState({
      visible: !visible
    });
    !visible ? e.target.classList.add('open') : e.target.classList.remove('open');

  }


  getFocus(e){
    let attr = e.target.getAttribute('name');
    if(attr === 'username'){
      this.setState({
        usernameEmptyError: false
      });
    } else {
      this.setState({
        passwordEmptyError: false
      });
    }
  }


  render(){
    const {__, lang} = this.props,
      {visible, errorinfo, usernameEmptyError, passwordEmptyError, isSubmitting, errorOccur} = this.state;
    return (
      <div>
        <header></header>
        <div className="login-wrapper">
          <img src="/public/assets/login/logo.jpg" alt="同方云"/>
          <form method="post" >
            <input className={usernameEmptyError ? 'error' : ''} ref={node => this.username = node} onFocus={this.getFocus} type="text" name="username" placeholder={__.account_placeholder}/>
            <input className={passwordEmptyError ? 'error' : ''} ref={node => this.password = node} onFocus={this.getFocus} type={ visible ? 'text' : 'password'} name="password" placeholder={__.password_placeholder}/>
            <i className="anticon anticon-eye" onClick={this.toggoleVisibility}></i>
            <div className="error-info">
              <i className="anticon anticon-exclamation-circle" style={{display : errorOccur ? 'inline' : 'none'}}></i>
              <span>{errorinfo}</span>
            </div>
            <input type="submit" onClick={this.onClick} className={isSubmitting ? 'disabled' : ''} value={__.login} />
          </form>
        </div>
        {
          lang === 'zh-cn'
          ? <ul>
            <li><a href="javascript: void 0">中文</a></li>
            <li><a href="/login/?locale=en" className="active">English</a></li>
          </ul>
            :<ul>
              <li><a href="/login/?locale=zh-CN" className="active">中文</a></li>
              <li><a href="javascript: void 0">English</a></li>
            </ul>
        }
      </div>
    );
  }
}

export default Model;
