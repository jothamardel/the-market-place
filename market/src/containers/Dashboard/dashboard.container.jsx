import React, { Component } from "react";
import { Link } from 'react-router-dom';
import BusinessDetails from '../../components/Card/card.component';
import { Drawer, Button, Icon, Input, Badge } from "flwww";
import { connect } from "react-redux";
import { logoutUser } from '../../redux/User/user.actions';
import { getBusinesses } from '../../redux/Business/business.actions';
import { getCoordinates } from '../../redux/Coordinates/coordinates.actions';
import './dashboard.styles.css';

class Dashboard extends Component {
  constructor(){
    super();
    this.state = {
      drawerIsVisible: false,
      searchBox: '',
      filteredBusiness: []
    }
  }

  componentDidMount(){
    const { getBusinesses, getCoordinates } = this.props;
    getBusinesses();
    if ('geolocation' in navigator) {
      window.navigator.geolocation.getCurrentPosition((success) => {
        const lat = success.coords.latitude;
        const lng = success.coords.longitude;
        getCoordinates( lat, lng);
      });
    }

    if (this.props.business.business) {
      const { business: { business } } = this.props;
      this.setState({ filteredBusiness: business });
    }
  }

  toggleDrawer = () => {
    this.setState(prevState => ({ drawerIsVisible: !prevState.drawerIsVisible }))
  }

  onSearchChange = (event) => {
    event.preventDefault();
    console.log(event.target.value)
    console.log()
    this.setState({ searchBox: event.target.value });
  }
  runSearch = () => {
    let biz = [];
    if (this.props.business.business) {
      const { business: { business } } =  this.props;
      biz = business.filter((item) => (
        item.name.toLowerCase().includes(this.state.searchBox.toLowerCase())
      ))
      this.setState({ filteredBusiness: biz })
    }
  }

  render(){
    const { logoutUser } = this.props;
    
    return (
      <div className='dashboard'>
        <div className='dashboard_menu' onClick={ this.toggleDrawer }>
          <Icon type="menu"  color='#079992'/>
          <span>Menu</span>
        </div>
        <h4>Businesses</h4>
        <div className='dashboard_stat'>
          <Badge count={100}>
            <p>Abuja</p>
          </Badge>
          <Badge count={200}>
            <p>Total</p>
          </Badge>
          <Badge count={100}>
            <p>Jos</p>                      
          </Badge>
        </div>
        <div className='dashboard_search'>
          <Input
            style={{ fontSize: "1rem", marginBottom: ".7rem" }}
            icon="search"
            name='name'
            onChange={ this.onSearchChange }
            placeholder="search for business"/>
            <Button outlined 
            style={{  height: "30px" }}
            type='submit'
            onClick={ this.runSearch }
            >search</Button>
        </div>
        <div className='dashboard_business'>
          {
            this.state.filteredBusiness.length > 0 ? 
            this.state.filteredBusiness.map((item, index) => (
                <BusinessDetails 
                  key={item.id}
                  name = {item.name}
                  phoneno = {item.phoneno}
                  rcNumber = {item.rc_number}
                 registered = {item.registered}
                />
            )) : <h6>No Result</h6>
          }
        
        </div>
        <Drawer
          showDrawer={ this.state.drawerIsVisible }
          toggleDrawer={ this.toggleDrawer }
          >
          <div className='drawer-items'>
            <Link to='/register'>
              <div className='drawer-items_menu'>
                <Icon type="edit2" size='25px' color='#079992'/>
                <h3>Register business</h3>
              </div>
            </Link>
            <Link to='/update'>
              <div className='drawer-items_menu'>
                <Icon type="edit" color='#079992'/>
                <h3>Update business</h3>
              </div>
            </Link>
            <Link to='/dashboard'>
              <div className='drawer-items_menu'>
                <Icon type="book" color='#079992'/>
                <h3>View business</h3>
              </div>
            </Link>
            <Link to='/login' onClick={ logoutUser }>
              <div className='drawer-items_menu'>
                <Icon type="logout" color='#079992'/>
                <h3>Logout</h3>
              </div>
            </Link>
          </div>
        </Drawer>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  business: state.business
});

const mapDispatchToProps = (dispatch) => ({
  logoutUser: () => dispatch(logoutUser()),
  getBusinesses: () => dispatch(getBusinesses()),
  getCoordinates: (lat, lng) => dispatch(getCoordinates(lat,lng))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);