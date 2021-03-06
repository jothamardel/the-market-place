import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'flwww';
import CreateBusiness from './containers/CreateBusiness/create-business.container';
import HomePage from './components/HomePage/home-page.component';
import AdminLogin from './containers/AdminLogin/admin-login.container';
// import Dashboard from './containers/Dashboard/dashboard.container';
import KasuwaDashboard from './containers/Kasuwa/dashboard.component';
import Registration from './containers/KasuwaRegistration/registration.component';
import EditBusiness from './containers/EditBusiness/edit-business.container';
import './App.css';
import { connect } from 'react-redux';
// import ModalMessage from './components/ModalMessage/modal-message.component';


const theme = {
  defaultColor: "#079992",
  defaultTextColor: "#ffff",
  primaryColor: "#38ada9",
  primaryTextColor: "#262626",
  successColor: "#78e08f",
  successTextColor: "#262626",
  dangerColor: "#b71540",
  dangerTextColor: "#262626",
};

function App({ user, modal, register: { status } }) {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path='/' render={() => user.status === 200 ? <Redirect to="/dashboard" /> : <HomePage />} />
        <Route exact path='/register-user' render={() => (user.status === 200 ? <Redirect to='/dashboard' /> : <Registration />)} />
        <Route exact path='/login' render={() => user.status === 200 ? <Redirect to="/dashboard" /> : <AdminLogin />} />
        <Route exact path='/dashboard' render={() => <KasuwaDashboard />} />
        <Route exact path='/register' component={CreateBusiness} />
        <Route exact path='/edit' component={EditBusiness} />
      </Switch>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  modal: state.modal,
  register: state.register
});

export default connect(mapStateToProps)(App);
