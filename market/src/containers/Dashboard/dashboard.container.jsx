import React, { Component } from "react";
import { Link } from 'react-router-dom';
import BusinessDetails from '../../components/Card/card.component';
import { Drawer, Button, Icon, Input, Badge } from "flwww";
import { connect } from "react-redux";
import { logoutUser } from '../../redux/User/user.actions';
import { getBusinesses } from '../../redux/Business/business.actions';
import { getCoordinates } from '../../redux/Coordinates/coordinates.actions';
import { showModal } from "../../redux/Modal/modal.actions";
import ShowModal from '../Modal/modal.container';
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

    const { getBusinesses } = this.props;

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
    this.setState({ searchBox: event.target.value });
  }
  runSearch = () => {
    let biz = [];
    if (this.props.business.business) {
      const { business: { business } } =  this.props;
      console.log(business);
      biz = business.filter((item) => (
        item.business_name.toLowerCase().includes(this.state.searchBox.toLowerCase())
      ))
      this.setState({ filteredBusiness: biz })
    }
  }

  render(){
    const { logoutUser } = this.props;
    const { filteredBusiness } = this.state;
    let regBusinesses = [];
    if (this.props.business.business) {
      const { business: { business } } =  this.props;
      regBusinesses = business;
    }
    return (
      <div className='dashboard'>
        <div className='dashboard_menu' onClick={ this.toggleDrawer }>
          <Icon type="menu"  color='#079992'/>
          <span>Menu</span>
        </div>
        <h4>{`Welcome, ${this.props.user.currentUser ? this.props.user.currentUser.name : null}!`}</h4>
        <h4>Businesses</h4>
        <div className='dashboard_stat'>
          <Badge count={this.props.business.business ? regBusinesses.filter(business => business.city.toLowerCase() === 'abuja').length : 'loading...'}>
            <p>Abuja</p>
          </Badge>
          <Badge count={this.props.business.business ? regBusinesses.length : 'loading...'}>
            <p>Total</p>
          </Badge>
          <Badge count={this.props.business.business ? regBusinesses.filter(business => business.city.toLowerCase() === 'jos').length : 'loading'}>
            <p>Jos</p>                      
          </Badge>
        </div>
        <div className='dashboard_search'>
          <div>

            <Input
              style={{ fontSize: "1rem", marginBottom: ".7rem", marginRight: "1rem" }}
              className='search'
              icon="search"
              name='name'
              onChange={ this.onSearchChange }
              placeholder="search for business"/>

            <span style={{ border: "1px solid black", padding: "0.3rem", cursor: "pointer", fontSize: "0.6rem" }} onClick={() => {
                const { getBusinesses } = this.props;
                getBusinesses();
                window.location.reload()
              }}>
                {/* <Icon type="refresh" />  */}
                X
            </span>
            
          </div>

            <Button outlined 
            style={{  height: "30px" }}
            type='submit'
            onClick={ this.runSearch }
            >
             {
               this.state.filteredBusiness.length === 0 ? 'Refresh' : 'Search'
             }
            </Button>
        </div>
        <div className='dashboard-business_container'>

          {
            (filteredBusiness.length > 0) ? 
            filteredBusiness.map((item, index) => (
              <div className='dashboard_business' onClick={() => this.props.showModal(item._id)} key={item._id}>
                <BusinessDetails 
                  key={item._id}
                  name = {item.business_name}
                  phoneno = {item.phone_number}
                  rcNumber = {item.rc_number}
                  registered = {item.registered}
                /> 
              </div>
            )) : <h6 className='dashboard_business_no-result'>No Result</h6>
          }
        
        </div>
        

        {
          this.props.modal.showModal ?
          <ShowModal /> : null
        }


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
            <Link to='/dashboard'>
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
  business: state.business,
  modal: state.modal,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  logoutUser: () => dispatch(logoutUser()),
  getBusinesses: () => dispatch(getBusinesses()),
  showModal: (index) => dispatch(showModal(index))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);