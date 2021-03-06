import React from "react";
import { Link } from 'react-router-dom'
import { Input, Button, Icon } from "flwww";
import { connect } from "react-redux";
import { loginUserAsync } from '../../redux/User/user.actions';

import './admin-login.styles.css';

class AdminLogin extends React.Component {
  constructor() {
    super();
    this.state = {
      name: null,
      password: null,
      error: {
        name: true,
        password: true
      },
      loading: true
    }
  }

  handleSubmit = () => {
    const { name, password } = this.state;
    const { loginUserAsync } = this.props;
    this.setState({ loading: true })
    if (!name) {
      this.setState({ error: { name: true } })
      return;
    }
    if (!password) {
      this.setState({ error: { password: true } })
      return;
    }

    loginUserAsync(name, password);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value, error: {
        name: true, password: true
      }
    })
  }

  render() {
    const { user: { isPending, errorStatus } } = this.props;
    return (
      <div className='admin-login'>
        <div className='admin-login_container'>
          <div>
            <Link to='/register-user' className='admin-login_link'>
              <Icon type="arrowLeftCircle" size="30px" color="#079992" />
              <p>Back</p>
            </Link>
          </div>
          {
            !errorStatus ? null :
              <h5 className="admin-login_error_red"
              >{errorStatus}</h5>
          }
          <Input
            style={{ fontSize: "1rem", marginBottom: ".7rem" }}
            icon="user"
            name='name'
            error={this.state.error.name ? 0 : 1}
            placeholder="Mobile Number"
            onChange={this.handleChange} />

          <Input
            style={{ fontSize: "1rem", marginBottom: ".7rem" }}
            icon="key"
            error={this.state.error.password ? 0 : 1}
            name='password'
            type='password'
            placeholder="password"
            onChange={this.handleChange} />
          {
            isPending ?
              <Button outlined loading={"true"}>Login</Button>
              :
              <Button outlined onClick={this.handleSubmit}>Login</Button>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  loginUserAsync: (name, password) => dispatch(loginUserAsync(name, password))
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminLogin);