import React, { useEffect, useState } from 'react'
import { useStateValue } from '../../ContextApi/StateProvider';
import firebase from 'firebase'
import Background from '../../images/bg/image-2.jpg'
import Modal from '@material-ui/core/Modal'
import { Button, createMuiTheme, Input, makeStyles, TextField, ThemeProvider, withStyles } from '@material-ui/core';
import {db} from '../../Database/Database'
import { Autocomplete } from '@material-ui/lab';
import $ from 'jquery'
import './FlightSearch.css'
import { useHistory } from 'react-router-dom';
import Dashboard from '../Dashboard';

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


function AdminFilghtSearch() {

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
       fetch('https://api.travelvogues.com/api/GetAirportList', requestOptions)
      .then(response => response.json())
      .then(data =>
        {
        console.log(data)
        setFromData(data);
        })
        }
      getData();
      }
  }
  
    
  
  useEffect(()=>{
  
    $(function () {
      $(".dropdown li").on('mouseenter mouseleave', function (e) {
      if ($(window).width() > 991) {
        console.log("called")
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
    console.log(query)
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
            infantCount:infantCount
          }
      })
  
    history.push("/adminonewayflightdeatails")
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
            infantCount:infantCount
          }
      })
  
    history.push("/admintwowayflightdeatails")
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
        
      
        
        <div id="content">
          <div class="hero-wrap py-4 py-md-5">
            <div class="hero-mask opacity-7 "></div>
            
            <div class="hero-content py-0 py-lg-3">
              <div class="container">
                <div class="row">
                  <div class="col-lg-6">
                    <div class="position-relative px-4 pt-3 pb-4">
                      <div class="hero-mask opacity-8  rounded " style={{backgroundColor:"#343A40"}}></div>
                      <div class="hero-content">
                        
                        <ul class="nav nav-tabs nav-fill style-4 border-bottom" id="myTab" role="tablist">
                          <li class="nav-item"> <a class="nav-link active" id="flight-tab" data-toggle="tab" href="#flight" role="tab" aria-controls="flight" aria-selected="true">Flights</a> </li>
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
                                 freeSolo
                                 id="combo-box-demo"
                                 options={fromData}
                                 getOptionLabel={(airport) => airport.Airport}
                                 onChange={(event, value) =>setFrom(value.AirportCode)} 
                                 renderInput={(params) => 
                                 <CssTextField 
                                  className={[classes.root]}
                                  value={from} onChange={onFromChange}
                                  
                                 {...params}  
                                 label="From"  variant="standard"
                                />}
                                
       /> 
                                <span class="icon-inside"><i class="fas fa-map-marker-alt"></i></span> 
      
                                  </div>
      
                                  <div class="col-lg-6 form-group">
                                 
                                <Autocomplete
                                freeSolo
                                 id="combo-box-demo"
                                 options={toData}
                                 getOptionLabel={(airport) => airport.Airport}
                                 onChange={(event, value) =>setTo(value.AirportCode)} 
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
      
      
                        </div>
                      </div>
                    </div>
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

export default AdminFilghtSearch;
