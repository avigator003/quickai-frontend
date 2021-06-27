import React, { useEffect, useState } from 'react'
import { useStateValue } from '../ContextApi/StateProvider';
import firebase from 'firebase'
import Background from '../images/bg/image-2.jpg'
import Modal from '@material-ui/core/Modal'
import { Button, createMuiTheme, Input, makeStyles, TextField, ThemeProvider, withStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import $ from 'jquery'
import './FlightSearch.css'
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
const CssTextField = withStyles({
  
  root: {

    "& .MuiFormLabel-root": {
      color: "#CCCCCC",
      fontWeight:300
    },
    '& label.Mui-focused': {
      color: '#889099',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#889099',
      },
      '&:hover fieldset': {
        borderColor: '#889099',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#889099',
      },
    },
    
    '& .MuiInput-underline:after': {
      borderBottomColor: '#889099',
    },
    '& .MuiInput-underline:before': {
      borderWidth:2,
      borderBottomColor: '#889099',
      padding:50,
      fontSize:30
    },
    
    '& .MuiInput-underline:hover': {
      borderBottomColor: '#889099',
    },
    '& .MuiInput-focused': {
      color: '#889099',
    },
   
   
  },
})(TextField);


const muitheme= createMuiTheme({
overrides: {
        MuiInput: {
            root: {
                fontSize: 16,
                padding: '10px 12px',
                color:"white",
                
            },
            
        }
    } 
});


function FilghtSearch() {

const classes=makeStyles();
const[from,setFrom]=useState("");
const[to,setTo]=useState("");
const[departDate,setDepartDate]=useState();
const[returnDate,setReturnDate]=useState();
const[flightClass,setFlightClass]=useState(1);
const [adultCount,setAdultCount]=useState(1);
const[childrenCount,setChildrenCount]=useState(0);
const [infantCount,setInfantCount]=useState(0);
const[fromData,setFromData]=useState([]);
const[toData,setToData]=useState([]);
const[flightWay,setFlightWay]=useState(1)
const[showRadio,setShowRadio]=useState(false)
const history=useHistory();
const [{flightDetails},dispatch]=useStateValue();
const [userId,setUserId]=useState()


useEffect(()=>{
  let id=uuidv4();
  setUserId(id)
},[])

const onFocus=(e)=>{
  e.currentTarget.type = "date";
}

const onBlur=(e)=>{
 e.currentTarget.type = "text";
 e.currentTarget.placeholder = "Enter a Date";
}


const onFromChange=(event)=>{
  event.preventDefault()
  
  var query=event.target.value;
  setFrom(query)

  if(query.length<=2)
  {
  }
  else{

  const getData=async()=>{
    const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Query: query })
      };
     fetch('http://travelvogues.com/Api/AirportList', requestOptions)
    .then(response => response.json())
    .then(data =>
      {
        console.log("list",data)
        setFromData(data)})
      }
    getData();
    }
}

  

useEffect(()=>{

  $(function () {
    $(".dropdown li").on('mouseenter mouseleave', function (e) {
		if ($(window).width() > 991) {
		        var elm = $('.dropdown-menu', this);
            if(elm.length>0)
            {
            var off = elm.offset();
		      	var l = off.left;
             var w = elm.width();
			 var docW = $(window).width();
			var isEntirelyVisible = (l + w <= docW);
            if (!isEntirelyVisible) {
				$(elm).addClass('dropdown-menu-right');
            } 
            else {
                $(elm).removeClass('dropdown-menu-right');
            }
          }
          else{
            
          }
			}
    });
});
},[])

  
useEffect(()=>{
  
  const script = document.createElement("script");
  script.async = true;
  script.src = window.location.origin + '/js/theme.js';
  document.body.appendChild(script);

},[])

const onToChange=(event)=>{
  event.preventDefault()
  
  var query=event.target.value;
  setTo(query)
  if(query.length<=2)
  {
  }
  else{

  const getData=async()=>{
    const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Query: query })
      };
     fetch('https://api.travelvogues.com/api/GetAirportList', requestOptions)
    .then(response => response.json())
    .then(data =>
      {
      console.log(data)
      setToData(data);
      })
      }
    getData();
    }
}


const setFlight=()=>{
  setAdultCount(document.getElementById("flightAdult-travellers").value)
  setChildrenCount(document.getElementById("flightChildren-travellers").value);
  setInfantCount(document.getElementById("flightInfants-travellers").value)

}



const addFromData=(event)=>{
  event.preventDefault();
  if(flightWay==1)
  {
  localStorage.setItem( 'from', from );
  localStorage.setItem( 'to', to );
  localStorage.setItem( 'departDate', departDate );
  localStorage.setItem( 'returnDate', departDate );
  localStorage.setItem( 'flightClass', flightClass );
  localStorage.setItem( 'way', flightWay );
  localStorage.setItem( 'adultCount', adultCount );
  localStorage.setItem( 'childrenCount', childrenCount );
  localStorage.setItem( 'infantCount', infantCount );
  

  
 
  setFlight();
  dispatch({
        type:'ADD_TO_FLIGHT',
        item:{
          way:flightWay,
          from:from,
          to:to,
          departDate:departDate,
          arriveDate:returnDate,
          flightClass:flightClass,
          adultCount:adultCount,
          childrenCount:childrenCount,
          infantCount:infantCount,
          
        }
    })
    
    axios.post('http://localhost:8000/flight', {
      way:flightWay,
      from:from,
      to:to,
      departDate:departDate,
      arriveDate:returnDate,
      flightClass:flightClass,
      adultCount:adultCount,
      childrenCount:childrenCount,
      infantCount:infantCount,
      userid:userId
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

  history.push("/onewayflights")
  }
  
  
else{
  localStorage.setItem( 'from', from );
  localStorage.setItem( 'to', to );
  localStorage.setItem( 'departDate', departDate );
  localStorage.setItem( 'returnDate', returnDate );
  localStorage.setItem( 'flightClass', flightClass );
  localStorage.setItem( 'way', flightWay );
  localStorage.setItem( 'adultCount', adultCount );
  localStorage.setItem( 'childrenCount', childrenCount );
  localStorage.setItem( 'infantCount', infantCount );
  

  
if(new Date(returnDate)-new Date(departDate)<0)
{
  alert("Depart date Cannot be less Than arrival Date")
}
 else{
  setFlight();
  dispatch({
        type:'ADD_TO_FLIGHT',
        item:{
          way:flightWay,
          from:from,
          to:to,
          departDate:departDate,
          arriveDate:returnDate,
          flightClass:flightClass,
          adultCount:adultCount,
          childrenCount:childrenCount,
          infantCount:infantCount,
          userid:userId
        }
    })

    axios.post('http://localhost:8000/flight', {
      way:flightWay,
      from:from,
      to:to,
      departDate:departDate,
      arriveDate:returnDate,
      flightClass:flightClass,
      adultCount:adultCount,
      childrenCount:childrenCount,
      infantCount:infantCount,
      userid:userId
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  history.push("/twowayflights")
}
}


}


const handleFlightWay=(e)=>{
setShowRadio(!showRadio)
setFlightWay(e.target.value)
}

    return (
      
<>
<div id="main-wrapper"> 
  
  <header id="header">
    <div class="container">
      <div class="header-row">
        <div class="header-column justify-content-start"> 
          
          <div class="logo"> <a href="index-2.html" title="Quickai - HTML Template"><img src="images/logo.png" alt="Quickai" width="127" height="29" /></a> </div>
          
        </div>
        <div class="header-column justify-content-end"> 
          
          <nav class="primary-menu navbar navbar-expand-lg">
            <div id="header-nav" class="collapse navbar-collapse">
              <ul class="navbar-nav">
                <li class="dropdown active"> <a class="dropdown-toggle" href="#">Home</a>
                  <ul class="dropdown-menu">
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Index 1</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="index-2.html">Recharge or Bill Payment</a></li>
                        <li><a class="dropdown-item" href="booking-hotels.html">Booking</a></li>
                      </ul>
                    </li>
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Index 2</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="index-3.html">Recharge or Bill Payment</a></li>
                        <li><a class="dropdown-item" href="booking-hotels-2.html">Booking</a></li>
                      </ul>
                    </li>
                    <li><a class="dropdown-item" href="index-4.html">Index 3 - (Recharge & Bill)</a></li>
                    <li><a class="dropdown-item" href="index-5.html">Index 4 - (Booking)</a></li>
                    <li><a class="dropdown-item" href="index-6.html">Index 5 - (Recharge & Bill)</a></li>
                    <li><a class="dropdown-item" href="index-7.html">Index 6 - (Booking)</a></li>
                    <li><a class="dropdown-item" href="index-8.html">Index 7 - (Recharge & Bill)</a></li>
                    <li><a class="dropdown-item" href="index-9.html">Index 8 - (Booking)</a></li>
                    <li><a class="dropdown-item" href="index-10.html">Index 9 - (Booking)</a></li>
                    <li><a class="dropdown-item" href="index-11.html">Index 10 - (Recharge & Bill)</a></li>
                    <li><a class="dropdown-item" href="index-12.html">Index 11 - (Mobile Top-Up)</a></li>
                  </ul>
                </li>
                <li class="dropdown"> <a class="dropdown-toggle" href="#">Recharge & Bill Payment</a>
                  <ul class="dropdown-menu dropdown-menu-sm">
                    <li>
                      <div class="row">
                        <div class="col-lg-6">
                          <ul class="dropdown-mega-submenu">
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Mobile</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="index-2.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="index-3.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">DTH</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-dth.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-dth-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Data Card</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-datacard.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-datacard-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Broadband</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-broadband.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-broadband-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Landline</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-landline.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-landline-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Cable TV</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-cabletv.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-cabletv-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Electricity</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-electricity.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-electricity-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Metro</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-metro.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-metro-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Gas</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-gas.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-gas-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                            <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Water</a>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="recharge-bill-water.html">Layout 1</a></li>
                                <li><a class="dropdown-item" href="recharge-bill-water-2.html">Layout 2</a></li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                        <div class="col-lg-6">
                          <ul class="dropdown-mega-submenu">
                            <li><a class="dropdown-item" href="recharge-order.html">Order</a></li>
                            <li><a class="dropdown-item" href="recharge-order-summary.html">Order Summary</a></li>
                            <li><a class="dropdown-item" href="recharge-payment.html">Payment</a></li>
                            <li><a class="dropdown-item" href="recharge-payment-success.html">Payment Success</a></li>
                            <li><a class="dropdown-item" href="recharge-plans.html">Recharge - Plans</a></li>
                            <li><a class="dropdown-item" href="recharge-plans-2.html">Recharge - Plans 2</a></li>
                            <li><a class="dropdown-item" href="recharge-plans-3.html">Recharge - Plans 3</a></li>
                            <li><a class="dropdown-item" href="recharge-invoice.html" target="_blank">Invoice</a></li>
                            <li><a class="dropdown-item" href="email-template/recharge-email-template/index.html" target="_blank">Email Template</a></li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li class="dropdown dropdown-mega"> <a class="dropdown-toggle" href="#">Booking</a>
                  <ul class="dropdown-menu">
                    <li>
                      <div class="row">
                        <div class="col-lg"> <span class="sub-title">Hotels</span>
                          <ul class="dropdown-mega-submenu">
                            <li><a class="dropdown-item" href="booking-hotels.html">Home Layout 1</a></li>
                            <li><a class="dropdown-item" href="booking-hotels-2.html">Home Layout 2</a></li>
                            <li><a class="dropdown-item" href="booking-hotels-list.html">Hotel List</a></li>
                            <li><a class="dropdown-item" href="booking-hotels-grid.html">Hotel Grid</a></li>
                            <li><a class="dropdown-item" href="booking-hotels-details.html">Hotel Details</a></li>
                            <li><a class="dropdown-item" target="_blank" href="booking-hotels-invoice.html">Invoice</a></li>
                            <li><a class="dropdown-item" target="_blank" href="email-template/hotel-email-template/index.html">Email Template</a></li>
                          </ul>
                        </div>
                        <div class="col-lg"> <span class="sub-title">Flight</span>
                          <ul class="dropdown-mega-submenu">
                            <li><a class="dropdown-item" href="booking-flights.html">Home Layout 1</a></li>
                            <li><a class="dropdown-item" href="booking-flights-2.html">Home Layout 2</a></li>
                            <li><a class="dropdown-item" href="booking-flights-one-way.html">One Way Trip List</a></li>
                            <li><a class="dropdown-item" href="booking-flights-round-trip.html">Round Trip List</a></li>
                            <li><a class="dropdown-item" href="booking-flights-confirm-details.html">Confirm Details</a></li>
                            <li><a class="dropdown-item" target="_blank" href="booking-flights-itinerary.html">Itinerary</a></li>
                            <li><a class="dropdown-item" target="_blank" href="booking-flights-invoice.html">Invoice</a></li>
                            <li><a class="dropdown-item" target="_blank" href="email-template/flight-email-template/index.html">Email Template</a></li>
                          </ul>
                        </div>
                        <div class="col-lg"> <span class="sub-title">Trains</span>
                          <ul class="dropdown-mega-submenu">
                            <li><a class="dropdown-item" href="booking-trains.html">Home Layout 1</a></li>
                            <li><a class="dropdown-item" href="booking-trains-2.html">Home Layout 2</a></li>
                            <li><a class="dropdown-item" href="booking-trains-list.html">Trains List</a></li>
                            <li><a class="dropdown-item" href="booking-trains-confirm-details.html">Confirm Details</a></li>
                            <li><a class="dropdown-item" target="_blank" href="booking-trains-invoice.html">Invoice</a></li>
                            <li><a class="dropdown-item" target="_blank" href="email-template/train-email-template/index.html">Email Template</a></li>
                          </ul>
                        </div>
                        <div class="col-lg"> <span class="sub-title">Bus</span>
                          <ul class="dropdown-mega-submenu">
                            <li><a class="dropdown-item" href="booking-bus.html">Home Layout 1</a></li>
                            <li><a class="dropdown-item" href="booking-bus-2.html">Home Layout 2</a></li>
                            <li><a class="dropdown-item" href="booking-bus-list.html">Bus List</a></li>
                            <li><a class="dropdown-item" href="booking-bus-confirm-details.html">Confirm Details</a></li>
                            <li><a class="dropdown-item" target="_blank" href="booking-bus-invoice.html">Invoice</a></li>
                            <li><a class="dropdown-item" target="_blank" href="email-template/bus-email-template/index.html">Email Template</a></li>
                          </ul>
                        </div>
                        <div class="col-lg"> <span class="sub-title">Cars</span>
                          <ul class="dropdown-mega-submenu">
                            <li><a class="dropdown-item" href="booking-cars.html">Home Layout 1</a></li>
                            <li><a class="dropdown-item" href="booking-cars-2.html">Home Layout 2</a></li>
                            <li><a class="dropdown-item" href="booking-cars-list.html">Cars List</a></li>
                            <li><a class="dropdown-item" href="booking-cars-grid.html">Cars Grid</a></li>
                            <li><a class="dropdown-item" href="booking-cars-grid-2.html">Cars Grid 2</a></li>
                            <li><a class="dropdown-item" href="booking-cars-details.html">Car Details</a></li>
                            <li><a class="dropdown-item" target="_blank" href="booking-cars-invoice.html">Invoice</a></li>
                            <li><a class="dropdown-item" target="_blank" href="email-template/car-email-template/index.html">Email Template</a></li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li class="dropdown"> <a class="dropdown-toggle" href="#">Features</a>
                  <ul class="dropdown-menu">
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Headers</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="index-2.html">Light Version (Default)</a></li>
                        <li><a class="dropdown-item" href="index-5.html">Dark Version</a></li>
                        <li><a class="dropdown-item" href="index-6.html">Primary Version</a></li>
                        <li><a class="dropdown-item" href="index-9.html">Transparent</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-custom-background-with-transparent-header.html">Transparent with border</a></li>
                      </ul>
                    </li>
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Navigation DropDown</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="index-2.html">Light Version (Default)</a></li>
                        <li><a class="dropdown-item" href="index-4.html">Dark Version</a></li>
                        <li><a class="dropdown-item" href="index-7.html">Primary Version</a></li>
                      </ul>
                    </li>
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Page Headers</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="feature-page-header-left-alignment.html">Left Alignment</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-center-alignment.html">Center Alignment</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-light.html">Light Version</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-dark.html">Dark Version</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-primary.html">Primary Version</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-custom-background.html">Custom Background</a></li>
                        <li><a class="dropdown-item" href="feature-page-header-custom-background-with-transparent-header.html">Custom Background 2</a></li>
                      </ul>
                    </li>
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Footer</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="index-2.html">Light Version Default</a></li>
                        <li><a class="dropdown-item" href="index-8.html">Alternate Version</a></li>
                        <li><a class="dropdown-item" href="feature-footer-dark.html">Dark Version</a></li>
                        <li><a class="dropdown-item" href="feature-footer-primary.html">Primary Version</a></li>
                      </ul>
                    </li>
                    <li><a class="dropdown-item" href="feature-layout-boxed.html">Layout Boxed</a></li>
                  </ul>
                </li>
                <li class="dropdown"> <a class="dropdown-toggle" href="#">Pages</a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="about-us.html">About Us</a></li>
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">Login/Signup</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="login-signup.html">Page</a></li>
                        <li><a class="dropdown-item" data-toggle="modal" data-target="#login-signup" href="#">Dialog Popup</a></li>
                      </ul>
                    </li>
                    <li class="dropdown"><a class="dropdown-item dropdown-toggle" href="#">My Profile</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="profile.html">Personal Information</a></li>
                        <li><a class="dropdown-item" href="profile-favourites.html">Favourites</a></li>
                        <li><a class="dropdown-item" href="profile-cards.html">Credit or Debit Cards</a></li>
                        <li><a class="dropdown-item" href="profile-notifications.html">Notifications</a></li>
                        <li><a class="dropdown-item" href="profile-orders-history.html">Orders History</a></li>
                        <li><a class="dropdown-item" href="profile-password.html">Change Password</a></li>
                      </ul>
                    </li>
                    <li><a class="dropdown-item" href="payment.html">Payment</a></li>
                    <li><a class="dropdown-item" href="payment-2.html">Payment 2</a></li>
                    <li><a class="dropdown-item" href="help.html">Help</a></li>
                    <li><a class="dropdown-item" href="faq.html">Faq</a></li>
                    <li><a class="dropdown-item" href="support.html">Support</a></li>
                    <li><a class="dropdown-item" href="contact-us.html">Contact Us</a></li>
                    <li><a class="dropdown-item" href="elements.html">Elements</a></li>
                    <li><a class="dropdown-item" href="elements-2.html">Elements 2</a></li>
                  </ul>
                </li>
                <li class="login-signup ml-lg-2"><a class="pl-lg-4 pr-0" data-toggle="modal" data-target="#login-signup" href="#" title="Login / Sign up">Login / Sign up <span class="d-none d-lg-inline-block"><i class="fas fa-user"></i></span></a></li>
              </ul>
            </div>
          </nav>
          
        </div>
        
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#header-nav"> <span></span> <span></span> <span></span> </button>
      </div>
    </div>
  </header>


  
  <div id="content">
    <div class="hero-wrap py-4 py-md-5">
      <div class="hero-mask opacity-7 bg-primary"></div>
      <div class="hero-bg" style={{background: `url(${Background})`,}}></div>
      <div class="hero-content py-0 py-lg-3">
        <div class="container">
          <div class="row">
            <div class="col-lg-6">
              <div class="position-relative px-4 pt-3 pb-4">
                <div class="hero-mask opacity-8 bg-dark rounded"></div>
                <div class="hero-content">
                  
                  <ul class="nav nav-tabs nav-fill style-4 border-bottom" id="myTab" role="tablist">
                    <li class="nav-item"> <a class="nav-link active" id="flight-tab" data-toggle="tab" href="#flight" role="tab" aria-controls="flight" aria-selected="true">Flights</a> </li>
                 
                 { /*
                    <li class="nav-item"> <a class="nav-link" id="hotels-tab" data-toggle="tab" href="#hotels" role="tab" aria-controls="hotels" aria-selected="true">Hotels</a> </li>
                    <li class="nav-item"> <a class="nav-link" id="trains-tab" data-toggle="tab" href="#trains" role="tab" aria-controls="trains" aria-selected="false">Trains</a> </li>
                    <li class="nav-item"> <a class="nav-link" id="bus-tab" data-toggle="tab" href="#bus" role="tab" aria-controls="bus" aria-selected="false">Bus</a> </li>
                    <li class="nav-item"> <a class="nav-link" id="car-tab" data-toggle="tab" href="#car" role="tab" aria-controls="car" aria-selected="false">Cars</a> </li>
                   */
                 }
           </ul>
                  <div class="tab-content pt-4" id="myTabContent">
                   
                    <div class="tab-pane fade show active" id="flight" role="tabpanel" aria-labelledby="flight-tab">
                    <form id="bookingFlight" class="search-input-line" method="post" onSubmit={addFromData}>
                        <div class="text-light mb-2" >
                          <div class="custom-control custom-radio custom-control-inline">
                            <input id="oneway" name="flight-trip" class="custom-control-input" value="1" onChange={handleFlightWay} checked={!showRadio} required type="radio"/>
                            <label class="custom-control-label" for="oneway">One Way</label>
                          </div>
                          <div class="custom-control custom-radio custom-control-inline">
                            <input id="roundtrip" name="flight-trip" class="custom-control-input" value="2" onChange={handleFlightWay} checked={showRadio}  required type="radio"/>
                            <label class="custom-control-label" for="roundtrip">Round Trip</label>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-lg-6 form-group ">

                          <Autocomplete
                               loading={true}
                       
                           freeSolo
                           id="combo-box-demo"
                           options={fromData}
                           getOptionLabel={(airport) => airport.AIRPORTNAME}
                           onChange={(event, value) =>setFrom(value.AirPortCode)} 
                           renderInput={(params) => 
                            <>
                           <CssTextField 
                           
                            className={[classes.root]}
                            value={from} onChange={onFromChange}
                           {...params}  
                           label="From"  variant="standard"
                          />
                        </>
                        }
                          
 /> 
                          <span class="icon-inside"><i class="fas fa-map-marker-alt"></i></span> 

                            </div>

                            <div class="col-lg-6 form-group">
                           
                           
                          <Autocomplete
                          loading={true}
                          freeSolo
                           id="combo-box-demo"
                           options={toData}
                           getOptionLabel={(airport) => airport.AIRPORTNAME}
                           onChange={(event, value) =>setTo(value.AirPortCode)} 
                           renderInput={(params) => 
                            <ThemeProvider theme={muitheme}>
                           <CssTextField 
                            className={[classes.root]}
                           {...params} value={to} onChange={onToChange} 
                           label="To"  variant="standard"
                          /></ThemeProvider>}/>           
                           <span class="icon-inside"><i class="fas fa-map-marker-alt"></i></span> </div>
                         </div>


                        <div class="row">

                        <div class={flightWay==2?"col-lg-6 form-group":"col-lg-12 form-group"}>
                        <input type="text" className="form-control" required placeholder="Depart Date" onFocus = {onFocus} onBlur={onBlur} value={departDate} onChange={e=>setDepartDate(e.target.value)}/>
                             </div>
                          
                  {flightWay==2?
                        (<div class="col-lg-6 form-group">
                        <input type="text" className="form-control" placeholder="Return Date" onFocus = {onFocus} onBlur={onBlur} value={returnDate} onChange={e=>setReturnDate(e.target.value)}/>
                        </div>):<></>}
                        </div>

                        <div class="travellers-class form-group">
                        <input type="text" id="flightTravellersClass" class="travellers-class-input form-control" name="flight-travellers-class" placeholder="Travellers, Class" autoComplete="off" readonly required />
                          <a href="#"></a> <span class="icon-inside"><i class="fas fa-caret-down"></i></span>
                        
                          <div class="travellers-dropdown">
                            <div class="row align-items-center">
                              <div class="col-sm-7">
                                <p class="mb-sm-0">Adults <small class="text-muted">(12+ yrs)</small></p>
                              </div>
                              <div class="col-sm-5">
                                <div class="qty input-group">
                                  <div class="input-group-prepend">
                                    <button type="button" class="btn bg-light-4" data-value="decrease" data-target="#flightAdult-travellers" data-toggle="spinner">-</button>
                                  </div>
                                  <input type="text" data-ride="spinner" id="flightAdult-travellers" class="qty-spinner form-control" value={adultCount} onChange={event=>setAdultCount(event.target.value)} />
                                  <div class="input-group-append">
                                    <button type="button" class="btn bg-light-4" data-value="increase" data-target="#flightAdult-travellers" data-toggle="spinner">+</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr class="my-2"/>
                            <div class="row align-items-center">
                              <div class="col-sm-7">
                                <p class="mb-sm-0">Children <small class="text-muted">(2-12 yrs)</small></p>
                              </div>
                              <div class="col-sm-5">
                                <div class="qty input-group">
                                  <div class="input-group-prepend">
                                    <button type="button" class="btn bg-light-4" data-value="decrease" data-target="#flightChildren-travellers" data-toggle="spinner">-</button>
                                  </div>
                                  <input type="text" data-ride="spinner" id="flightChildren-travellers" class="qty-spinner form-control" value={childrenCount} onChange={event=>setChildrenCount(event.target.value)}/>
                                  <div class="input-group-append">
                                    <button type="button" class="btn bg-light-4" data-value="increase" data-target="#flightChildren-travellers" data-toggle="spinner">+</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr class="my-2"/>
                            <div class="row align-items-center">
                              <div class="col-sm-7">
                                <p class="mb-sm-0">Infants <small class="text-muted">(Below 2 yrs)</small></p>
                              </div>
                              <div class="col-sm-5">
                                <div class="qty input-group">
                                  <div class="input-group-prepend">
                                    <button type="button" class="btn bg-light-4" data-value="decrease" data-target="#flightInfants-travellers" data-toggle="spinner">-</button>
                                  </div>
                                  <input type="text" data-ride="spinner" id="flightInfants-travellers" class="qty-spinner form-control" value={infantCount} onChange={event=>setInfantCount(event.target.value)} />
                                  <div class="input-group-append">
                                    <button type="button" class="btn bg-light-4" data-value="increase" data-target="#flightInfants-travellers" data-toggle="spinner">+</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                         
                            <hr class="mt-2"/>
                            <div class="mb-3">
                              <div class="custom-control custom-radio">
                                <input id="flightClassEconomic" name="flight-class" class="flight-class custom-control-input" value="1"  checked onChange={e=>setFlightClass(e.target.value)}  required type="radio"/>
                                <label class="custom-control-label" for="flightClassEconomic">Economic</label>
                              </div>
                              <div class="custom-control custom-radio">
                                <input id="flightClassPremiumEconomic" name="flight-class" class="flight-class custom-control-input" value="2"  onChange={e=>setFlightClass(e.target.value)} required type="radio"/>
                                <label class="custom-control-label" for="flightClassPremiumEconomic">Premium Economic</label>
                              </div>
                              <div class="custom-control custom-radio">
                                <input id="flightClassBusiness" name="flight-class" class="flight-class custom-control-input" value="3"  onChange={e=>setFlightClass(e.target.value)} required type="radio"/>
                                <label class="custom-control-label" for="flightClassBusiness">Business</label>
                              </div>
                              <div class="custom-control custom-radio">
                                <input id="flightClassFirstClass" name="flight-class" class="flight-class custom-control-input" value="4"  onChange={e=>setFlightClass(e.target.value)} required type="radio"/>
                                <label class="custom-control-label" for="flightClassFirstClass">First Class</label>
                              </div>
                            </div>
                            <button class="btn btn-primary btn-block submit-done" onClick={setFlight}  type="button">Done</button>
                          </div>
                        </div>
                        <button class="btn btn-primary btn-block mt-4" >Search Flights</button>
                    </form>
                    </div>



                    <div class="tab-pane fade" id="hotels" role="tabpanel" aria-labelledby="hotels-tab">
                      <form id="bookingHotels" class="search-input-line" method="post">
  <div class="row">
    <div class="col-lg-12 form-group">
      <input type="text" class="form-control" id="hotelsFrom" required placeholder="Enter Locality, City"/>
      <span class="icon-inside"><i class="fas fa-map-marker-alt"></i></span> </div>
  </div>
  <div class="row">
    <div class="col-lg-6 form-group">
      <input id="hotelsCheckIn" type="text" class="form-control" required placeholder="Check In"/>
      <span class="icon-inside"><i class="far fa-calendar-alt"></i></span> </div>
    <div class="col-lg-6 form-group">
      <input id="hotelsCheckOut" type="text" class="form-control" required placeholder="Check Out"/>
      <span class="icon-inside"><i class="far fa-calendar-alt"></i></span> </div>
  </div>
  <div class="travellers-class form-group">
    <input type="text" id="hotelsTravellersClass" class="travellers-class-input form-control" name="hotels-travellers-class" placeholder="Rooms / People" required onKeyPress="return false;"/>
    <span class="icon-inside"><i class="fas fa-caret-down"></i></span>
    <div class="travellers-dropdown" style={{display: "none"}}>
      <div class="row align-items-center">
        <div class="col-sm-7">
          <p class="mb-sm-0">Rooms</p>
        </div>
        <div class="col-sm-5">
          <div class="qty input-group">
            <div class="input-group-prepend">
              <button type="button" class="btn bg-light-4" data-value="decrease" data-target="#hotels-rooms" data-toggle="spinner">-</button>
            </div>
            <input type="text" data-ride="spinner" id="hotels-rooms" class="qty-spinner form-control" value="1" min="40" readonly/>
            <div class="input-group-append">
              <button type="button" class="btn bg-light-4" data-value="increase" data-target="#hotels-rooms" data-toggle="spinner">+</button>
            </div>
          </div>
        </div>
      </div>
      <hr class="mt-2 mb-4"/>
      <div class="row align-items-center">
        <div class="col-sm-7">
          <p class="mb-sm-0">Adults <small class="text-muted">(12+ yrs)</small></p>
        </div>
        <div class="col-sm-5">
          <div class="qty input-group">
            <div class="input-group-prepend">
              <button type="button" class="btn bg-light-4" data-value="decrease" data-target="#adult-travellers" data-toggle="spinner">-</button>
            </div>
            <input type="text" data-ride="spinner" id="adult-travellers" class="qty-spinner form-control" value="1" readonly/>
            <div class="input-group-append">
              <button type="button" class="btn bg-light-4" data-value="increase" data-target="#adult-travellers" data-toggle="spinner">+</button>
            </div>
          </div>
        </div>
      </div>
      <hr class="my-2"/>
      <div class="row align-items-center">
        <div class="col-sm-7">
          <p class="mb-sm-0">Children <small class="text-muted">(1-12 yrs)</small></p>
        </div>
        <div class="col-sm-5">
          <div class="qty input-group">
            <div class="input-group-prepend">
              <button type="button" class="btn bg-light-4" data-value="decrease" data-target="#children-travellers" data-toggle="spinner">-</button>
            </div>
            <input type="text" data-ride="spinner" id="children-travellers" class="qty-spinner form-control" value="0" readonly/>
            <div class="input-group-append">
              <button type="button" class="btn bg-light-4" data-value="increase" data-target="#children-travellers" data-toggle="spinner">+</button>
            </div>
          </div>
        </div>
      </div>
      <button class="btn btn-primary btn-block submit-done mt-3" onClick={setFlight} type="button">Done</button>
    </div>
  </div>
  <button class="btn btn-primary btn-block mt-4" type="submit">Search Hotels</button>
</form>
                    </div>



                    
                    <div class="tab-pane fade" id="trains" role="tabpanel" aria-labelledby="trains-tab">
                      <form id="bookingTrain" class="search-input-line" method="post">
                        <div class="row">
                          <div class="col-12 form-group">
                            <input type="text" class="form-control" id="trainFrom" required placeholder="From" />
                            <span class="icon-inside"><i class="fas fa-map-marker-alt"></i></span> </div>
                            
                          <div class="col-12 form-group">
                            <input type="text" class="form-control" id="trainTo" required placeholder="To"/>
                            <span class="icon-inside"><i class="fas fa-map-marker-alt"></i></span> </div>
                          <div class="col-12 form-group">
                            <input id="trainDepart" type="text" class="form-control" required placeholder="Depart Date"/>
                            <span class="icon-inside"><i class="far fa-calendar-alt"></i></span> </div>
                          <div class="col-12 travellers-class form-group">
                            <input type="text" id="trainTravellersClass"  class="travellers-class-input form-control" name="train-travellers-class" placeholder="Travellers, Class" required/>
                            <span class="icon-inside"><i class="fas fa-caret-down"></i></span>
                            
                            <div class="travellers-dropdown">
                              <div class="row align-items-center">
                                <div class="col-sm-7">
                                  <p class="mb-sm-0">Adults <small class="text-muted">(12+ yrs)</small></p>
                                </div>
                                <div class="col-sm-5">
                                  <div class="qty input-group">
                                    <div class="input-group-prepend">
                                      <button type="button" class="btn bg-light-4" data-value="decrease" data-target="#trainAdult-travellers" data-toggle="spinner">-</button>
                                    </div>
                                    <input type="text" data-ride="spinner" id="trainAdult-travellers" class="qty-spinner form-control" value="1" readonly/>
                                    <div class="input-group-append">
                                      <button type="button" class="btn bg-light-4" data-value="increase" data-target="#trainAdult-travellers" data-toggle="spinner">+</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr class="my-2"/>
                              <div class="row align-items-center">
                                <div class="col-sm-7">
                                  <p class="mb-sm-0">Children <small class="text-muted">(2-12 yrs)</small></p>
                                </div>
                                <div class="col-sm-5">
                                  <div class="qty input-group">
                                    <div class="input-group-prepend">
                                      <button type="button" class="btn bg-light-4" data-value="decrease" data-target="#trainChildren-travellers" data-toggle="spinner">-</button>
                                    </div>
                                    <input type="text" data-ride="spinner" id="trainChildren-travellers" class="qty-spinner form-control" value="0" readonly/>
                                    <div class="input-group-append">
                                      <button type="button" class="btn bg-light-4" data-value="increase" data-target="#trainChildren-travellers" data-toggle="spinner">+</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr class="my-2"/>
                              <div class="row align-items-center">
                                <div class="col-sm-7">
                                  <p class="mb-sm-0">Infants <small class="text-muted">(Below 2 yrs)</small></p>
                                </div>
                                <div class="col-sm-5">
                                  <div class="qty input-group">
                                    <div class="input-group-prepend">
                                      <button type="button" class="btn bg-light-4" data-value="decrease" data-target="#trainInfants-travellers" data-toggle="spinner">-</button>
                                    </div>
                                    <input type="text" data-ride="spinner" id="trainInfants-travellers" class="qty-spinner form-control" value="0" readonly/>
                                    <div class="input-group-append">
                                      <button type="button" class="btn bg-light-4" data-value="increase" data-target="#trainInfants-travellers" data-toggle="spinner">+</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="form-group mt-3">
                                <select id="train-class" name="train-class" class="custom-select">
                                  <option value="0">All Class</option>
                                  <option value="1">First Class</option>
                                  <option value="2">Second Class</option>
                                  <option value="3">First Class Sleeper (SL)</option>
                                  <option value="4">Second Class Sleeper (SL)</option>
                                  <option value="5">Business</option>
                                </select>
                              </div>
                              <button class="btn btn-primary btn-block submit-done" type="button">Done</button>
                            </div>
                          </div>
                        </div>
                        <button class="btn btn-primary btn-block mt-2" type="submit">Search Trains</button>
                      </form>
                    </div>
                    <div class="tab-pane fade" id="bus" role="tabpanel" aria-labelledby="bus-tab">
                      <form id="bookingBus" class="search-input-line" method="post">
                        <div class="row">
                          <div class="col-12 form-group">
                            <input type="text" class="form-control" id="busFrom" required placeholder="From"/>
                            <span class="icon-inside"><i class="fas fa-map-marker-alt"></i></span> </div>
                          <div class="col-12 form-group">
                            <input type="text" class="form-control" id="busTo" required placeholder="To"/>
                            <span class="icon-inside"><i class="fas fa-map-marker-alt"></i></span> </div>
                          <div class="col-12 form-group">
                            <input id="busDepart" type="text" class="form-control" required placeholder="Depart Date"/>
                            <span class="icon-inside"><i class="far fa-calendar-alt"></i></span> </div>
                          <div class="col-12 travellers-class form-group">
                            <input type="text" id="busTravellersClass"  class="travellers-class-input form-control" name="bus-travellers-class" placeholder="Seats" required onkeypress="return false;"/>
                            <span class="icon-inside"><i class="fas fa-caret-down"></i></span>
                            
                            <div class="travellers-dropdown">
                              <div class="row align-items-center mb-3">
                                <div class="col-sm-7">
                                  <p class="mb-sm-0">Seats</p>
                                </div>
                                <div class="col-sm-5">
                                  <div class="qty input-group">
                                    <div class="input-group-prepend">
                                      <button type="button" class="btn bg-light-4" data-value="decrease" data-target="#adult-travellers" data-toggle="spinner">-</button>
                                    </div>
                                    <input type="text" data-ride="spinner" id="adult-travellers" class="qty-spinner form-control" value="1" readonly/>
                                    <div class="input-group-append">
                                      <button type="button" class="btn bg-light-4" data-value="increase" data-target="#adult-travellers" data-toggle="spinner">+</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <button class="btn btn-primary btn-block submit-done" type="button">Done</button>
                            </div>
                          </div>
                        </div>
                        <button class="btn btn-primary btn-block mt-2" type="submit">Search Bus</button>
                      </form>
                    </div>

                    <div class="tab-pane fade" id="car" role="tabpanel" aria-labelledby="car-tab">
                      <form id="bookingCars" class="search-input-line" method="post">
                <div class="row">
                  <div class="col-lg form-group">
                    <input type="text" class="form-control ui-autocomplete-input" id="carsCity" required placeholder="Enter City" autocomplete="off"/>
                    <span class="icon-inside"><i class="fas fa-map-marker-alt"></i></span> </div>
                </div>
                <div class="row">
                <div class="col-8 form-group">
                  <input id="carsPickup" type="text" class="form-control" required placeholder="Pick-up date"/>
                  <span class="icon-inside"><i class="far fa-calendar-alt"></i></span> 
                  </div>
                  <div class="col-4 form-group">
                  <select class="custom-select" id="carsPickuptime" required="">
                  <option value="">12:00 am</option>
                  <option>12:30 am</option>
                  <option>01:00 am</option>
                  <option>01:30 am</option>
                  <option>02:00 am</option>
                  <option>02:30 am</option>
                  <option>03:00 am</option>
                  <option>03:30 am</option>
                  <option>04:00 am</option>
                  <option>04:30 am</option>
                  <option>05:00 am</option>
                  <option>05:30 am</option>
                  <option>06:00 am</option>
                  <option>06:30 am</option>
                  <option>07:00 am</option>
                  <option>07:30 am</option>
                  <option>08:00 am</option>
                  <option>08:30 am</option>
                  <option>09:00 am</option>
                  <option>09:30 am</option>
                  <option>10:00 am</option>
                  <option>10:30 am</option>
                  <option>11:00 am</option>
                  <option>11:30 am</option>
                  <option>12:00 pm</option>
                  <option>12:30 pm</option>
                  <option>01:00 pm</option>
                  <option>01:30 pm</option>
                  <option>02:00 pm</option>
                  <option>02:30 pm</option>
                  <option>03:00 pm</option>
                  <option>03:30 pm</option>
                  <option>04:00 pm</option>
                  <option>04:30 pm</option>
                  <option>05:00 pm</option>
                  <option>05:30 pm</option>
                  <option>06:00 pm</option>
                  <option>06:30 pm</option>
                  <option>07:00 pm</option>
                  <option>07:30 pm</option>
                  <option>08:00 pm</option>
                  <option>08:30 pm</option>
                  <option>09:00 pm</option>
                  <option>09:30 pm</option>
                  <option>10:00 pm</option>
                  <option>10:30 pm</option>
                  <option>11:00 pm</option>
                  <option>11:30 pm</option>
                </select> 
                  </div>
                  </div>
                <div class="row">
                <div class="col-8 form-group">
                  <input id="carsDropoff" type="text" class="form-control" required placeholder="Drop-off date"/>
                  <span class="icon-inside"><i class="far fa-calendar-alt"></i></span> 
                  </div>
                  <div class="col-4 form-group">
                  <select class="custom-select" id="carsDropofftime" required="">
                  <option value="">12:00 am</option>
                  <option>12:30 am</option>
                  <option>01:00 am</option>
                  <option>01:30 am</option>
                  <option>02:00 am</option>
                  <option>02:30 am</option>
                  <option>03:00 am</option>
                  <option>03:30 am</option>
                  <option>04:00 am</option>
                  <option>04:30 am</option>
                  <option>05:00 am</option>
                  <option>05:30 am</option>
                  <option>06:00 am</option>
                  <option>06:30 am</option>
                  <option>07:00 am</option>
                  <option>07:30 am</option>
                  <option>08:00 am</option>
                  <option>08:30 am</option>
                  <option>09:00 am</option>
                  <option>09:30 am</option>
                  <option>10:00 am</option>
                  <option>10:30 am</option>
                  <option>11:00 am</option>
                  <option>11:30 am</option>
                  <option>12:00 pm</option>
                  <option>12:30 pm</option>
                  <option>01:00 pm</option>
                  <option>01:30 pm</option>
                  <option>02:00 pm</option>
                  <option>02:30 pm</option>
                  <option>03:00 pm</option>
                  <option>03:30 pm</option>
                  <option>04:00 pm</option>
                  <option>04:30 pm</option>
                  <option>05:00 pm</option>
                  <option>05:30 pm</option>
                  <option>06:00 pm</option>
                  <option>06:30 pm</option>
                  <option>07:00 pm</option>
                  <option>07:30 pm</option>
                  <option>08:00 pm</option>
                  <option>08:30 pm</option>
                  <option>09:00 pm</option>
                  <option>09:30 pm</option>
                  <option>10:00 pm</option>
                  <option>10:30 pm</option>
                  <option>11:00 pm</option>
                  <option>11:30 pm</option>
                </select> 
                  </div>
                  </div>
                <div class="custom-control custom-checkbox d-inline-block text-white-50 mb-4 mt-2">
              <input type="checkbox" id="terms" name="termsConditions" checked="" class="custom-control-input"/>
              <label class="custom-control-label d-block" for="terms">Driver aged 25 - 70 <span class="text-info" data-toggle="tooltip" data-original-title="Car rental suppliers may charge more if a driver is under 30 or over 60. Please check the car's terms &amp; conditions."><i class="far fa-question-circle"></i></span></label>
              </div>
                <button class="btn btn-primary btn-block" type="submit">Search Cars</button>
              </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6 mt-5 mt-lg-0">
              <h2 class="text-9 font-weight-600 text-light">Why Booking with Travel Vogues ?</h2>
              <p class="lead mb-4 text-light">Online Booking. Save Time and Money!</p>
              <div class="row">
                <div class="col-12">
                  <div class="featured-box style-3 mb-4">
                    <div class="featured-box-icon border rounded-circle text-light"> <i class="fas fa-dollar-sign"></i></div>
                    <h3 class="text-light">Cheapest Price</h3>
                    <p class="text-light opacity-8">Always get cheapest price with the best in the industry. So you get the best deal every time.</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="featured-box style-3 mb-4">
                    <div class="featured-box-icon border rounded-circle text-light"> <i class="fas fa-times"></i></div>
                    <h3 class="text-light">Easy Cancellation & Refunds</h3>
                    <p class="text-light opacity-8">Get instant refund and get any booking fees waived off! Easy cancellation process is available.</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="featured-box style-3">
                    <div class="featured-box-icon border rounded-circle text-light"> <i class="fas fa-percentage"></i></div>
                    <h3 class="text-light">No Booking Charges</h3>
                    <p class="text-light opacity-8 mb-0">No hidden charges, no payment fees, and free customer service. So you get the best deal every time!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section bg-light shadow-md">
      <div class="container"> 
        
        <div class="owl-carousel owl-theme banner" data-autoplay="true" data-loop="true" data-nav="true" data-margin="30" data-items-xs="1" data-items-sm="2" data-items-md="2" data-items-lg="3">
          <div class="item rounded"> <a href="#">
            <div class="caption">
              <h2>20% OFF</h2>
              <p>On Flight Booking</p>
            </div>
            <div class="banner-mask"></div>
            <img class="img-fluid" src="images/slider/booking-banner-4.jpg" alt="banner" /> </a> </div>
          <div class="item rounded"> <a href="#">
            <div class="caption">
              <h2>10% OFF</h2>
              <p>On Train Booking</p>
            </div>
            <div class="banner-mask"></div>
            <img class="img-fluid" src="images/slider/booking-banner-5.jpg" alt="banner" /> </a> </div>
          <div class="item rounded"> <a href="#">
            <div class="caption">
              <h2>25% OFF</h2>
              <p>On Bus Booking</p>
            </div>
            <div class="banner-mask"></div>
            <img class="img-fluid" src="images/slider/booking-banner-6.jpg" alt="banner" /> </a> </div>
        </div>
        <h2 class="text-9 font-weight-600 text-center mt-5">Start your travel planning here</h2>
        <p class="lead text-dark text-center mb-5">Search Hotels, Flights, Trains & Bus</p>
        <div class="row">
          <div class="col-md-6 col-lg-4">
            <div class="accordion accordion-alternate popularRoutes mx-lg-2" id="popularRoutes">
              <div class="card">
                <div class="card-header" id="one">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"> New Delhi <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseOne" class="collapse" aria-labelledby="one" data-parent="#popularRoutes">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - New Delhi <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - New Delhi <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - New Delhi <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - New Delhi <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - New Delhi <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - New Delhi <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Bhopal To Indore <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Bangalore to Chennai <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - New Delhi <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="two">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"> Bengaluru <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseTwo" class="collapse" aria-labelledby="two" data-parent="#popularRoutes">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - Bengaluru <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - Bengaluru <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - Bengaluru <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - Bengaluru <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - Bengaluru <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Bengaluru <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Surat - Bengaluru <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Bengaluru <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - Bengaluru <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="three">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree"> Chennai <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseThree" class="collapse" aria-labelledby="three" data-parent="#popularRoutes">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - Chennai <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - Chennai <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - Chennai <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - Chennai <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - Chennai <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Chennai <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Surat - Chennai <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Chennai <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - Chennai <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="four">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour"> Mumbai <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseFour" class="collapse" aria-labelledby="four" data-parent="#popularRoutes">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - Mumbai <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - Mumbai <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - Mumbai <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - Mumbai <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - Mumbai <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Mumbai <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Surat - Mumbai <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Mumbai <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - Mumbai <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="five">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive"> Hyderabad <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseFive" class="collapse" aria-labelledby="five" data-parent="#popularRoutes">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - Hyderabad <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - Hyderabad <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - Hyderabad <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - Hyderabad <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - Hyderabad <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Hyderabad <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Surat - Hyderabad <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Hyderabad <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - Hyderabad <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="accordion accordion-alternate popularRoutes mx-lg-2" id="popularRoutes2">
              <div class="card">
                <div class="card-header" id="six">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix"> Chicago <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseSix" class="collapse" aria-labelledby="six" data-parent="#popularRoutes2">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - Chicago <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - Chicago <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - Chicago <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - Chicago <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - Chicago <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Chicago <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Bhopal To Chicago <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Bangalore to Chicago <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - Chicago <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="seven">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseSeven" aria-expanded="false" aria-controls="collapseTwo"> New York <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseSeven" class="collapse" aria-labelledby="seven" data-parent="#popularRoutes2">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - New York <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - New York <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - New York <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - New York <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - New York <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - New York <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Surat - New York <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - New York <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - New York <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="eight">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight"> London <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseEight" class="collapse" aria-labelledby="eight" data-parent="#popularRoutes2">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - London <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - London <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - London <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - London <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - London <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - London <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Surat - London <span class="ml-auto">$ 1,209+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="nine">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseNine" aria-expanded="false" aria-controls="collapseNine"> Panaji <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseNine" class="collapse" aria-labelledby="nine" data-parent="#popularRoutes2">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - Panaji <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - Panaji <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - Panaji <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - Panaji <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - Panaji <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Panaji <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Surat - Panaji <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Panaji <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - Panaji <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="ten">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseTen" aria-expanded="false" aria-controls="collapseTen"> Ahmedabad <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseTen" class="collapse" aria-labelledby="ten" data-parent="#popularRoutes2">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - Ahmedabad <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - Ahmedabad <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - Ahmedabad <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - Ahmedabad <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - Ahmedabad <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Ahmedabad <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Surat - Ahmedabad <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Ahmedabad <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - Ahmedabad <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="accordion accordion-alternate popularRoutes mx-lg-2" id="popularRoutes3">
              <div class="card">
                <div class="card-header" id="eleven">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseEleven" aria-expanded="false" aria-controls="collapseEleven"> Bangkok <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseEleven" class="collapse" aria-labelledby="eleven" data-parent="#popularRoutes3">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - Bangkok <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - Bangkok <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - Bangkok <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - Bangkok <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - Bangkok <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Bangkok <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Surat - Bangkok <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Bangkok <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - Bangkok <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="twelve">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseTwelve" aria-expanded="false" aria-controls="collapseTwelve"> Singapore <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseTwelve" class="collapse" aria-labelledby="twelve" data-parent="#popularRoutes3">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - Singapore <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - Singapore <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - Singapore <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - Singapore <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - Singapore <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Singapore <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Bhopal To Singapore <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Bangalore to Singapore <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - Singapore <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="thirteen">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseThirteen" aria-expanded="false" aria-controls="collapseThirteen"> Los Angeles <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseThirteen" class="collapse" aria-labelledby="thirteen" data-parent="#popularRoutes3">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - Los Angeles <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - Los Angeles <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - Los Angeles <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - Los Angeles <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - Los Angeles <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Los Angeles <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Surat - Los Angeles <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Los Angeles <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - Los Angeles <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="fourteen">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseFourteen" aria-expanded="false" aria-controls="collapseFourteen"> San Francisco <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseFourteen" class="collapse" aria-labelledby="fourteen" data-parent="#popularRoutes3">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - San Francisco <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - San Francisco <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - San Francisco <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - San Francisco <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - San Francisco <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - San Francisco <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Surat - San Francisco <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - San Francisco <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - San Francisco <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="fifteen">
                  <h5 class="collapsed mb-0" data-toggle="collapse" data-target="#collapseFifteen" aria-expanded="false" aria-controls="collapseFifteen">Hong Kong <span class="nav"><a href="#">HOTELS</a><a href="#">FLIGHTS</a><a href="#">TRAINS</a><a href="#">BUS</a></span> </h5>
                </div>
                <div id="collapseFifteen" class="collapse" aria-labelledby="fifteen" data-parent="#popularRoutes3">
                  <div class="card-body">
                    <ul class="routes-list">
                      <li><i class="fas fa-bed"></i></li>
                      <li><a href="#">The Orchid Hotel <span class="ml-auto">$ 210+</span></a></li>
                      <li><a href="#">Whistling Meadows Resort <span class="ml-auto">$ 675+</span></a></li>
                      <li><a href="#">Radisson Blu Hotel <span class="ml-auto">$ 280+</span></a></li>
                      <li><a href="#">The Lotus Hotel <span class="ml-auto">$ 412+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-plane"></i></li>
                      <li><a href="#">Jaipur - Hong Kong <span class="ml-auto">$ 1,015+</span></a></li>
                      <li><a href="#">Varanasi - Hong Kong <span class="ml-auto">$ 3,152+</span></a></li>
                      <li><a href="#">Amritsar - Hong Kong <span class="ml-auto">$ 4,137+</span></a></li>
                      <li><a href="#">Ahmedabad - Hong Kong <span class="ml-auto">$ 925+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-train"></i></li>
                      <li><a href="#">Surat - Hong Kong <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Hong Kong <span class="ml-auto">$ 1,999+</span></a></li>
                    </ul>
                    <ul class="routes-list">
                      <li><i class="fas fa-bus"></i></li>
                      <li><a href="#">Surat - Hong Kong <span class="ml-auto">$ 1,209+</span></a></li>
                      <li><a href="#">Kolkata - Hong Kong <span class="ml-auto">$ 1,999+</span></a></li>
                      <li><a href="#">Srinagar - Hong Kong <span class="ml-auto">$ 2,100+</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 mt-4">
            <p class="text-center mb-0"><a href="#" class="btn btn-link">View All <i class="fas fa-arrow-right ml-1"></i></a></p>
          </div>
        </div>
        
      </div>
    </div>
    
    <section class="section bg-secondary text-light shadow-md">
      <div class="container">
        <h2 class="text-9 text-light font-weight-600 text-center">Refer & Earn</h2>
        <p class="lead text-center mb-5">Refer your friends and earn up to $20.</p>
        <div class="row">
          <div class="col-md-4">
            <div class="featured-box style-3">
              <div class="featured-box-icon bg-primary text-light rounded-circle"> <i class="fas fa-bullhorn"></i> </div>
              <h3 class="text-light">You Refer Friends</h3>
              <p class="text-3 opacity-8">Share your referral link with friends. They get $10.</p>
            </div>
          </div>
          <div class="col-md-4 mt-4 mt-md-0">
            <div class="featured-box style-3">
              <div class="featured-box-icon bg-primary text-light rounded-circle"> <i class="fas fa-sign-in-alt"></i> </div>
              <h3 class="text-light">Your Friends Register</h3>
              <p class="text-3 opacity-8">Your friends Register with using your referral link.</p>
            </div>
          </div>
          <div class="col-md-4 mt-4 mt-md-0">
            <div class="featured-box style-3">
              <div class="featured-box-icon bg-primary text-light rounded-circle"> <i class="fas fa-dollar-sign"></i> </div>
              <h3 class="text-light">Earn You</h3>
              <p class="text-3 opacity-8">You get $20. You can use these credits to take recharge.</p>
            </div>
          </div>
        </div>
        <div class="text-center pt-4"> <a href="#" class="btn btn-outline-light">Get Started Earn</a> </div>
      </div>
    </section>
    <section class="section pb-0">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 text-center"> <img class="img-fluid" alt="" src="images/app-mobile-2.png"/> </div>
          <div class="col-lg-6 text-center text-lg-left">
            <h2 class="text-9 font-weight-600 my-4">Download Our Travel Vogues<br class="d-none d-lg-inline-block"/>
              Mobile App Now</h2>
            <p class="lead text-dark">Download our app for the fastest, most convenient way to Recharge & Bill Payment, Booking and more....</p>
            <div class="pt-3"> <a href="#" class="mr-4 btn btn-outline-primary shadow-none"><i class="fab fa-apple mr-1"></i> App Store</a> <a href="#" class="mr-4 btn btn-outline-primary shadow-none"><i class="fab fa-android mr-1"></i> Play Store</a></div>
          </div>
        </div>
      </div>
    </section>
    
  </div>
  <footer id="footer">
    <section class="section bg-light shadow-md pt-4 pb-3">
      <div class="container">
        <div class="row">
          <div class="col-sm-6 col-md-3">
            <div class="featured-box text-center">
              <div class="featured-box-icon"> <i class="fas fa-lock"></i> </div>
              <h4>100% Secure Payments</h4>
              <p>Moving your card details to a much more secured place.</p>
            </div>
          </div>
          <div class="col-sm-6 col-md-3">
            <div class="featured-box text-center">
              <div class="featured-box-icon"> <i class="fas fa-thumbs-up"></i> </div>
              <h4>Trust pay</h4>
              <p>100% Payment Protection. Easy Return Policy.</p>
            </div>
          </div>
          <div class="col-sm-6 col-md-3">
            <div class="featured-box text-center">
              <div class="featured-box-icon"> <i class="fas fa-bullhorn"></i> </div>
              <h4>Refer & Earn</h4>
              <p>Invite a friend to sign up and earn up to $100.</p>
            </div>
          </div>
          <div class="col-sm-6 col-md-3">
            <div class="featured-box text-center">
              <div class="featured-box-icon"> <i class="far fa-life-ring"></i> </div>
              <h4>24X7 Support</h4>
              <p>We're here to help. Have a query and need help ? <a href="#">Click here</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-4 mb-3 mb-md-0">
          <p>Payment</p>
          <ul class="payments-types">
            <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/visa.png" alt="visa" title="Visa"/></a></li>
            <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/discover.png" alt="discover" title="Discover"/></a></li>
            <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/paypal.png" alt="paypal" title="PayPal"/></a></li>
            <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/american.png" alt="american express" title="American Express"/></a></li>
            <li><a href="#" target="_blank"> <img data-toggle="tooltip" src="images/payment/mastercard.png" alt="discover" title="Discover"/></a></li>
          </ul>
        </div>
        <div class="col-md-4 mb-3 mb-md-0">
          <p>Subscribe</p>
          <div class="input-group newsletter">
            <input class="form-control" placeholder="Your Email Address" name="newsletterEmail" id="newsletterEmail" type="text"/>
            <span class="input-group-append">
            <button class="btn btn-secondary" type="submit">Subscribe</button>
            </span> </div>
        </div>
        <div class="col-md-4 d-flex align-items-md-end flex-column">
          <p>Keep in touch</p>
          <ul class="social-icons">
            <li class="social-icons-facebook"><a data-toggle="tooltip" href="http://www.facebook.com/" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a></li>
            <li class="social-icons-twitter"><a data-toggle="tooltip" href="http://www.twitter.com/" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a></li>
            <li class="social-icons-google"><a data-toggle="tooltip" href="http://www.google.com/" target="_blank" title="Google"><i class="fab fa-google"></i></a></li>
            <li class="social-icons-linkedin"><a data-toggle="tooltip" href="http://www.linkedin.com/" target="_blank" title="Linkedin"><i class="fab fa-linkedin-in"></i></a></li>
            <li class="social-icons-youtube"><a data-toggle="tooltip" href="http://www.youtube.com/" target="_blank" title="Youtube"><i class="fab fa-youtube"></i></a></li>
            <li class="social-icons-instagram"><a data-toggle="tooltip" href="http://www.instagram.com/" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="footer-copyright">
        <ul class="nav justify-content-center">
          <li class="nav-item"> <a class="nav-link active" href="#">About Us</a> </li>
          <li class="nav-item"> <a class="nav-link" href="#">Faq</a> </li>
          <li class="nav-item"> <a class="nav-link" href="#">Contact</a> </li>
          <li class="nav-item"> <a class="nav-link" href="#">Support</a> </li>
          <li class="nav-item"> <a class="nav-link" href="#">Terms of Use</a> </li>
          <li class="nav-item"> <a class="nav-link" href="#">Privacy Policy</a> </li>
        </ul>
        <p class="copyright-text">Copyright © 2018 <a href="#">Quickai</a>. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
  
</div>

<a id="back-to-top" data-toggle="tooltip" title="Back to Top" href="javascript:void(0)"><i class="fa fa-chevron-up"></i></a> 

<div id="login-signup" class="modal fade" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content p-sm-3">
      <div class="modal-body">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>
        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item"> <a id="login-tab" class="nav-link active text-4" data-toggle="tab" href="#login" role="tab" aria-controls="login" aria-selected="true">Login</a> </li>
          <li class="nav-item"> <a id="signup-tab" class="nav-link text-4" data-toggle="tab" href="#signup" role="tab" aria-controls="signup" aria-selected="false">Sign Up</a> </li>
        </ul>
        <div class="tab-content pt-4">
          <div class="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="login-tab">
            <form id="loginForm" method="post">
              <div class="form-group">
                <input type="email" class="form-control" id="loginMobile" required placeholder="Mobile or Email ID"/>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="loginPassword" required placeholder="Password"/>
              </div>
              <div class="row mb-4">
                <div class="col-sm">
                  <div class="form-check custom-control custom-checkbox">
                    <input id="remember-me" name="remember" class="custom-control-input" type="checkbox"/>
                    <label class="custom-control-label" for="remember-me">Remember Me</label>
                  </div>
                </div>
                <div class="col-sm text-right"> <a class="justify-content-end" href="#">Forgot Password ?</a> </div>
              </div>
              <button class="btn btn-primary btn-block" type="submit">Login</button>
            </form>
          </div>
          <div class="tab-pane fade" id="signup" role="tabpanel" aria-labelledby="signup-tab">
            <form id="signupForm" method="post">
              <div class="form-group">
                <input type="text" class="form-control" data-bv-field="number" id="signupEmail" required placeholder="Email ID"/>
              </div>
              <div class="form-group">
                <input type="text" class="form-control" id="signupMobile" required placeholder="Mobile Number"/>
              </div>
              <div class="form-group">
                <input type="password" class="form-control" id="signuploginPassword" required placeholder="Password"/>
              </div>
              <button class="btn btn-primary btn-block" type="submit">Signup</button>
            </form>
          </div>
          <div class="d-flex align-items-center my-4">
            <hr class="flex-grow-1"/>
            <span class="mx-2">OR</span>
            <hr class="flex-grow-1"/>
          </div>
          <div class="row">
            <div class="col-12 mb-3">
              <button type="button" class="btn btn-block btn-outline-primary">Login with Facebook</button>
            </div>
            <div class="col-12">
              <button type="button" class="btn btn-block btn-outline-danger">Login with Google</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</>
        
    )
}

export default FilghtSearch;
