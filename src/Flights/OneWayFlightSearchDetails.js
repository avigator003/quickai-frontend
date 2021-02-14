import React, { useEffect, useState } from 'react'
import { useStateValue } from '../ContextApi/StateProvider';
import $ from 'jquery'
import Pagination from 'react-js-pagination';
import useLocalStorage from 'react-use-localstorage';
import { CircularProgress, Modal } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import { auth } from '../Database/Database';


import Axios from 'axios'

function OneWayFlightSearchDetails() {
    const[{flight},dispatch]=useStateValue();
    const[flightData,setFlightData]=useState([]);

    const[activePage,setActivePage]=useState(1);

    const[totalCount,setTotalCount]=useState(0);

    const[from,setFrom]=useState( )
    const[to,setTo]=useState()
    const[departDate,setDepartDate]=useState()
    const[returnDate,setReturnDate]=useState()
    const[flightClass,setFlightClass]=useState()
    const[adultCount,setAdultCount]=useState()
    const[childrenCount,setChildrenCount]=useState()
    const[infantCount,setInfantCount]=useState()
    const[way,setWay]=useState()
    const[loading,setLoading]=useState(false)
    const[stopage,setStopage]=useState(false)
    const[currentFlights,setCurrentFlights]=useState([])
    const[activeModal,setActiveModal]=useState(null)
    const[tokenId,setTokenId]=useState();
    const[tokenLoading,setTokenLoading]=useState(false);
    const[markup,setMarkup]=useState()
const history=useHistory();

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
    


    const convertHour=(time)=>{
      var Hours = Math.floor(time /60)
    
      return Hours;
    }

    const convertMinute=(time)=>{
      var minutes = time % 60
      return minutes;
    }

      
    useEffect(()=>{
      
      const script = document.createElement("script");
      script.async = true;
      script.src = window.location.origin + '/js/theme.js';
      document.body.appendChild(script);
    
    },[])
    

    const fetchMoreData = () => {
      
      var pageNumber=activePage+1;
      var indexOfLastFlight=pageNumber*6;
      var indexOfFirstFlight=indexOfLastFlight-6;
      setTimeout(() => {
      setCurrentFlights(currentFlights.concat(flightData.slice(indexOfFirstFlight,indexOfLastFlight)
    ))
       }, 1500);
       setLoading(true)
      setActivePage(pageNumber)
     };

useEffect(()=>{


  var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];


  var weekday = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat']
  const search=async()=>{
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      
        EndUserIp: "192.168.10.10",
        TokenId: "c8a3db30-e3aa-4ea9-b962-5e6fcefc9318",
        AdultCount: localStorage.getItem( 'adultCount' ),
        ChildCount: localStorage.getItem( 'childrenCount' ),
        InfantCount: localStorage.getItem( 'infantCount' ),
        DirectFlight: "false",
        OneStopFlight: "false",
        JourneyType: localStorage.getItem( 'way' ),
        PreferredAirlines: null,
        Segments: [
        {
        Origin: localStorage.getItem( 'from' ),
        Destination:localStorage.getItem( 'to' ),
        FlightCabinClass:localStorage.getItem( 'flightClass' ),
        PreferredDepartureTime: localStorage.getItem( 'departDate' )+"T00: 00: 00",
        PreferredArrivalTime:localStorage.getItem( 'returnDate' )+"T00: 00: 00"
        }
                ],
        "Sources": null
        }
      
     )
};
await fetch('https://api.travelvogues.com/api/SearchFlights', requestOptions)
    .then(response => response.json())
    .then(data =>{
      console.log(data)
      var dataLength=data.Response.Results[0].length;
      setTotalCount(dataLength)
      var i;
      var flightDataArray=[];
      var fullDate=new Date(localStorage.getItem( 'departDate' ));
      var date=fullDate.getDate();
      var month=months[fullDate.getUTCMonth()];
      var day=weekday[fullDate.getDay()];
      var year=(fullDate.getFullYear()).toString().substring(2,4);

      var traceId=data.Response.TraceId;  

      for(i=0;i<dataLength;i++)
      {
        var dat=data.Response.Results[0];
        var totalBaseFare=dat[i].Fare.BaseFare;
        var totalTax=dat[i].Fare.Tax+dat[i].Fare.OtherCharges+dat[i].Fare.ServiceFee+dat[i].Fare.AdditionalTxnFeePub
        var publishedFare=dat[i].Fare.PublishedFare;
        if(parseInt(localStorage.getItem( 'adultCount' ))>0)
        {
        var adultBaseFare=dat[i].FareBreakdown[0].BaseFare;
        }
         if(parseInt(localStorage.getItem( 'childrenCount' ))>0)
        {
        var childrenBaseFare=dat[i].FareBreakdown[1].BaseFare
        }
        if(parseInt(localStorage.getItem( 'infantCount' ))>0)
        {
        var infantBaseFare=dat[i].FareBreakdown[2].BaseFare
        }
        var segments=dat[i].Segments[0];
        var segmentLength=dat[i].Segments[0].length;
        var j;
        var cityMainFrom=segments[0].Origin.Airport.CityName;
        var cityMainTo=segments[segmentLength-1].Destination.Airport.CityName;
        var mainDepTime=(segments[0].Origin.DepTime).substring(11,16);
        var mainArrTime=(segments[segmentLength-1].Destination.ArrTime).substring(11,16);
        var isRefundable=dat[i].IsRefundable;
        var ResultIndex=dat[i].ResultIndex;
       
        var segArray=[];
        for(j=0;j<segmentLength;j++)
        {
          var origin=segments[j].Origin.Airport.CityName
          var destination=segments[j].Destination.Airport.CityName
          var AirlineName=segments[j].Airline.AirlineName
          var AirlineCode=segments[j].Airline.AirlineCode
          var FlightNumber=segments[j].Airline.FlightNumber
          var originAirportName=segments[j].Origin.Airport.AirportName
          var destinationAirportName=segments[j].Destination.Airport.AirportName
          var depTime=(segments[j].Origin.DepTime).substring(11,16)
          var arrTime=(segments[j].Destination.ArrTime).substring(11,16)
          var Duration=segments[j].Duration
          var groundTime=segments[j].GroundTime
          var hour=convertHour(Duration+groundTime)
          var min=convertMinute(Duration+groundTime)
          segArray.push(
           {origin:origin,destination:destination,AirlineName:AirlineName,
            AirlineCode:AirlineCode,FlightNumber:FlightNumber,
            depTime:depTime,arrTime:arrTime,Duration:Duration,
            groundTime:groundTime,originAirportName:originAirportName,
            destinationAirportName:destinationAirportName,hour:hour,
            min:min
                  })
      }
      var stopage;
      if(segmentLength==1)
      {
        stopage=0
      }
      else{
        stopage=segmentLength-1
      }


       var durationArray=segArray.map(seg=>seg.Duration)
       var groundTimeArray=segArray.map(seg=>seg.groundTime)
       var totGroundTime=groundTimeArray.reduce((a,b)=>(a+=b),0)
       var totDuration=durationArray.reduce((a,b)=>(a+=b),0)
       var totalDuration=totGroundTime+totDuration
       var totalHours=convertHour(totalDuration);
       var totalMinutes=convertMinute(totalDuration)

       flightDataArray.push({
        publishedFare:publishedFare,totalBaseFare:totalBaseFare,totalTax:totalTax,
        adultBaseFare:adultBaseFare,childrenBaseFare:childrenBaseFare,
        infantBaseFare:infantBaseFare,cityMainFrom:cityMainFrom,cityMainTo:cityMainTo,
        mainDepTime:mainDepTime,mainArrTime:mainArrTime,segArray:segArray,
        totalDuration:totalDuration,totalHours:totalHours,totalMinutes:totalMinutes,
        stopage:stopage,day:day,year:year,date:date,month:month,isRefundable:isRefundable,
        resultIndex:ResultIndex,traceId:traceId
        
       })
       

      }

      console.log(flightDataArray)
      


      var indexOfLastFlight=activePage*6;
      var indexOfFirstFlight=indexOfLastFlight-6;
      var current=flightDataArray.slice(indexOfFirstFlight,indexOfLastFlight);
      

      setFlightData(flightDataArray)
      setCurrentFlights(current)
      getMarkup()
      setLoading(true)
    });
}

search();

},[])


const clickHandler=(e,index)=>{
setActiveModal(index)
}



const confirmFlight=(resultIndex,traceId)=>{


  history.push({
    pathname: '/confirmflight',
    state: { resultIndex:resultIndex, traceId:traceId}

}
)}

const getMarkup=async()=>{
Axios.get('http://localhost:8000/getmarkup')
.then(response=>{
  console.log("markup",response)
  if(response.data.length==0)
  {
    setMarkup(0)
  }
  else{
    setMarkup(response.data[0].Amount)
  }
}
  )

}


return (

      <>
     
<div id="main-wrapper">

<header id="header">
  <div class="container">
    <div class="header-row">
      <div class="header-column justify-content-start"> 
        
        <div class="logo">
          <a href="index-2.html" title="Quickai - HTML Template"><img src="images/logo.png" alt="Quickai" width="127" height="29" /></a>
        </div>
        
      </div>
      
      <div class="header-column justify-content-end">
      
        <nav class="primary-menu navbar navbar-expand-lg">
          <div id="header-nav" class="collapse navbar-collapse">
            <ul class="navbar-nav">
              <li class="dropdown"> <a class="dropdown-toggle" href="#">Home</a>
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
              <li class="dropdown dropdown-mega active"> <a class="dropdown-toggle" href="#">Booking</a>
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
                      <div class="col-lg"> <span class="sub-title">Flights</span>
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

  <section class="page-header page-header-text-light bg-secondary">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-8">
          <h1>Flights - One Way</h1>
        </div>
        <div class="col-md-4">
          <ul class="breadcrumb justify-content-start justify-content-md-end mb-0">
            <li><a href="index-2.html">Home</a></li>
            <li><a href="booking-flights.html">Flights</a></li>
            <li class="active">Flights One Way</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  
<div id="content">
  <section class="container">
      <div class="row">
        <div class="col mb-2">
          <form id="bookingFlight" method="post">
            <div class="mb-3">
              <div class="custom-control custom-radio custom-control-inline">
                <input id="oneway" name="flight-trip" class="custom-control-input" checked="" required type="radio"/>
                <label class="custom-control-label" for="oneway">One Way</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input id="roundtrip" name="flight-trip" class="custom-control-input" required type="radio"/>
                <label class="custom-control-label" for="roundtrip">Round Trip</label>
              </div>
            </div>
            <div class="form-row">
              <div class="col-md-4 col-lg-2 form-group">
                <input type="text" class="form-control" id="flightFrom" required placeholder="From"/>
                <span class="icon-inside"><i class="fas fa-map-marker-alt"></i></span> </div>
              <div class="col-md-4 col-lg-2 form-group">
                <input type="text" class="form-control" id="flightTo" required placeholder="To"/>
                <span class="icon-inside"><i class="fas fa-map-marker-alt"></i></span> </div>
              <div class="col-md-4 col-lg-2 form-group">
                <input id="flightDepart" type="text" class="form-control" required placeholder="Depart Date"/>
                <span class="icon-inside"><i class="far fa-calendar-alt"></i></span> </div>
              <div class="col-md-4 col-lg-2 form-group">
                <input id="flightReturn" type="text" class="form-control" required placeholder="Return Date"/>
                <span class="icon-inside"><i class="far fa-calendar-alt"></i></span> </div>
              <div class="col-md-4 col-lg-2 travellers-class form-group">
                <input type="text" id="flightTravellersClass" class="travellers-class-input form-control" name="flight-travellers-class" placeholder="Travellers, Class" readonly required onkeypress="return false;"/>
                <span class="icon-inside"><i class="fas fa-caret-down"></i></span>
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
                        <input type="text" data-ride="spinner" id="flightAdult-travellers" class="qty-spinner form-control" value="1" readonly/>
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
                        <div class="input-group-prep end">
                          <button type="button" class="btn bg-light-4" data-value="decrease" data-target="#flightChildren-travellers" data-toggle="spinner">-</button>
                        </div>
                        <input type="text" data-ride="spinner" id="flightChildren-travellers" class="qty-spinner form-control" value="0" readonly/>
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
                        <input type="text" data-ride="spinner" id="flightInfants-travellers" class="qty-spinner form-control" value="0" readonly/>
                        <div class="input-group-append">
                          <button type="button" class="btn bg-light-4" data-value="increase" data-target="#flightInfants-travellers" data-toggle="spinner">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr class="mt-2"/>
                  <div class="mb-3">
                    <div class="custom-control custom-radio">
                      <input id="flightClassEconomic" name="flight-class" class="flight-class custom-control-input" value="0" checked="" required type="radio"/>
                      <label class="custom-control-label" for="flightClassEconomic">Economic</label>
                    </div>
                    <div class="custom-control custom-radio">
                      <input id="flightClassPremiumEconomic" name="flight-class" class="flight-class custom-control-input" value="1" required type="radio"/>
                      <label class="custom-control-label" for="flightClassPremiumEconomic">Premium Economic</label>
                    </div>
                    <div class="custom-control custom-radio">
                      <input id="flightClassBusiness" name="flight-class" class="flight-class custom-control-input" value="2" required type="radio"/>
                      <label class="custom-control-label" for="flightClassBusiness">Business</label>
                    </div>
                    <div class="custom-control custom-radio">
                      <input id="flightClassFirstClass" name="flight-class" class="flight-class custom-control-input" value="3" required type="radio"/>
                      <label class="custom-control-label" for="flightClassFirstClass">First Class</label>
                    </div>
                  </div>
                  <button class="btn btn-primary btn-block submit-done" type="button">Done</button>
                </div>
              </div>
              <div class="col-md-4 col-lg-2 form-group">
                <button class="btn btn-primary btn-block" type="submit">Search</button>
              </div>
            </div>
          </form>
        </div>
      </div>


{loading?(

      <div class="row">


        <div class="col-md-3" >
          <div class="bg-light shadow-md rounded p-3" id="sidebar">
            <h3 class="text-5">Filter</h3>
            <div class="accordion accordion-alternate style-2" id="toggleAlternate">
              <div class="card">
                <div class="card-header" id="stops">
                  <h5 class="mb-0"> <a href="#" data-toggle="collapse" data-target="#togglestops" aria-expanded="true" aria-controls="togglestops">No. of Stops</a> </h5>
                </div>
                <div id="togglestops" class="collapse show" aria-labelledby="stops">
                  <div class="card-body">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" id="nonstop" name="stop" class="custom-control-input"/>
                      <label class="custom-control-label" for="nonstop">Non Stop</label>
                    </div>
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" id="1stop" name="stop" class="custom-control-input"/>
                      <label class="custom-control-label" for="1stop">1 Stop</label>
                    </div>
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" id="2stop" name="stop" class="custom-control-input"/>
                      <label class="custom-control-label" for="2stop">2+ Stop</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="departureTime">
                  <h5 class="mb-0"> <a href="#" class="collapse" data-toggle="collapse" data-target="#toggleDepartureTime" aria-expanded="true" aria-controls="toggleDepartureTime">Departure Time</a> </h5>
                </div>
                <div id="toggleDepartureTime" class="collapse show" aria-labelledby="departureTime">
                  <div class="card-body">
                    <div class="custom-control custom-checkbox clearfix">
                      <input type="checkbox" id="earlyMorning" name="departureTime" class="custom-control-input"/>
                      <label class="custom-control-label" for="earlyMorning">Early Morning</label>
                      <small class="text-muted float-right">12am - 8am</small> </div>
                    <div class="custom-control custom-checkbox clearfix">
                      <input type="checkbox" id="morning" name="departureTime" class="custom-control-input"/>
                      <label class="custom-control-label" for="morning">Morning</label>
                      <small class="text-muted float-right">8am - 12pm</small> </div>
                    <div class="custom-control custom-checkbox clearfix">
                      <input type="checkbox" id="midDay" name="departureTime" class="custom-control-input"/>
                      <label class="custom-control-label" for="midDay">Mid-Day</label>
                      <small class="text-muted float-right">12pm - 4pm</small> </div>
                    <div class="custom-control custom-checkbox clearfix">
                      <input type="checkbox" id="evening" name="departureTime" class="custom-control-input"/>
                      <label class="custom-control-label" for="evening">Evening</label>
                      <small class="text-muted float-right">4pm - 8pm</small> </div>
                    <div class="custom-control custom-checkbox clearfix">
                      <input type="checkbox" id="night" name="departureTime" class="custom-control-input"/>
                      <label class="custom-control-label" for="night">Night</label>
                      <small class="text-muted float-right">8pm - 12am</small> </div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="price">
                  <h5 class="mb-0"> <a href="#" class="collapse" data-toggle="collapse" data-target="#togglePrice" aria-expanded="true" aria-controls="togglePrice">Price</a> </h5>
                </div>
                <div id="togglePrice" class="collapse show" aria-labelledby="price">
                  <div class="card-body">
                    <p>
                      <input id="amount" type="text" readonly class="form-control border-0 bg-transparent p-0"/>
                    </p>
                    <div id="slider-range"></div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-header" id="airlines">
                  <h5 class="mb-0"> <a href="#" class="collapse" data-toggle="collapse" data-target="#toggleAirlines" aria-expanded="true" aria-controls="toggleAirlines">Airlines</a> </h5>
                </div>
                <div id="toggleAirlines" class="collapse show" aria-labelledby="airlines">
                  <div class="card-body">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" id="asianaAir" name="airlines" class="custom-control-input"/>
                      <label class="custom-control-label" for="asianaAir">Asiana Airlines</label>
                    </div>
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" id="americanAir" name="airlines" class="custom-control-input"/>
                      <label class="custom-control-label" for="americanAir">American Airlines</label>
                    </div>
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" id="airCanada" name="airlines" class="custom-control-input"/>
                      <label class="custom-control-label" for="airCanada">Air Canada</label>
                    </div>
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" id="airIndia" name="airlines" class="custom-control-input"/>
                      <label class="custom-control-label" for="airIndia">Air India</label>
                    </div>
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" id="jetAirways" name="airlines" class="custom-control-input"/>
                      <label class="custom-control-label" for="jetAirways">Jet Airways</label>
                    </div>
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" id="spicejet" name="airlines" class="custom-control-input"/>
                      <label class="custom-control-label" for="spicejet">Spicejet</label>
                    </div>
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" id="indiGo" name="airlines" class="custom-control-input"/>
                      <label class="custom-control-label" for="indiGo">IndiGo</label>
                    </div>
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" id="multiple" name="airlines" class="custom-control-input"/>
                      <label class="custom-control-label" for="multiple">Multiple Airlines</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div class="col-md-9 mt-4 mt-md-0" id="con">
    <div class="bg-light shadow-md rounded py-4">
    <div class="mx-3 mb-3 text-center">
    
  
      <h2 class="text-6">{flightData[0].cityMainFrom}
      <small class="mx-2">to</small>{flightData[0].cityMainTo}</h2>
    
    </div>
    <div class="text-1 bg-light-3 border border-right-0 border-left-0 py-2 px-3">
      <div class="row">
        <div class="col col-sm-2 text-center"><span class="d-none d-sm-block">Airline</span></div>
        <div class="col col-sm-2 text-center">Departure</div>
        <div class="col-sm-2 text-center d-none d-sm-block">Duration</div>
        <div class="col col-sm-2 text-center">Arrival</div>
        <div class="col col-sm-2 text-right">Price</div>
      </div>
    </div>

{currentFlights?
    <InfiniteScroll
          dataLength={currentFlights.length}
          next={fetchMoreData}
          hasMore={true}
          loader={<h4 style={{textAlign:"center",marginTop:30}}>Loading...</h4>}
        >

{
  currentFlights.map((flight,index)=>
  <div class="flight-list" style={{overflow:"hidden"}}>
      <div class="flight-item">
        <div class="row align-items-center flex-row pt-4 pb-2 px-3">
  <div class="col col-sm-2 text-center d-lg-flex company-info"> <span class="align-middle"><img class="img-fluid" alt="" src="images/brands/flights/indigo.png"/> </span> <span class="align-middle ml-lg-2"> <span class="d-block text-1 text-dark">{flight.segArray[0].AirlineName}</span>
  
  {
            flight.segArray.map(segment=>(
   <small class="text-muted d-block">{segment.AirlineCode}-{segment.FlightNumber}</small>))}
  </span> </div>
  <div class="col col-sm-2 text-center time-info"> <span class="text-4"></span> <small class="text-muted d-none d-sm-block">{flight.cityMainFrom}</small>{flight.mainDepTime}</div>
  <div class="col-sm-2 text-center d-none d-sm-block time-info"> <span class="text-3">{flight.totalHours==0?"":flight.totalHours+"h"} {flight.totalMinutes==0?"":flight.totalMinutes+"m"}</span> <small class="text-muted d-none d-sm-block">{flight.stopage==0?"Non Stop":flight.stopage+" Stop"}</small> </div>
          <div class="col col-sm-2 text-center time-info"> <span class="text-4"></span> <small class="text-muted d-none d-sm-block">{flight.cityMainTo}</small>{flight.mainArrTime}</div>
          <div class="col col-sm-2 text-right text-dark text-6 price" style={{fontWeight:500}}>₹{flight.publishedFare+markup}</div>
          <div class="col-12 col-sm-2 text-center ml-auto btn-book"> <a style={{cursor:"pointer",color:"white"}} onClick={()=>confirmFlight(flight.resultIndex,flight.traceId)} class="btn btn-sm btn-primary"><i class="fas fa-shopping-cart d-block d-lg-none"></i> <span class="d-none d-lg-block" >Book</span></a> </div>
           
          <div class="col col-sm-auto col-lg-2 ml-auto mt-1 text-1 text-center"><a style={{cursor:"pointer",color:"#0E7FD9"}} onClick={e => clickHandler(e, index)} >Flight Details</a></div>
        </div>


         <Modal id={index} open={activeModal==index}>
        
          <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Flight Details</h5>
                <button type="button" class="close" onClick={()=>setActiveModal(null)}> <span aria-hidden="true">&times;</span> </button>
              </div>
                <div class="modal-body">
                <div class="flight-details">
                  <div class="row mb-4">
                    <div class="col-12 col-sm-9 col-lg-8">
                      <div class="row align-items-center trip-title mb-3">
                        <div class="col col-sm-auto text-center text-sm-left">
                          <h5 class="m-0 trip-place">{flight.cityMainFrom}</h5>
                        </div>
                        <div class="col-auto text-10 text-black-50 text-center trip-arrow">➝</div>
                        <div class="col col-sm-auto text-center text-sm-left">
                          <h5 class="m-0 trip-place">{flight.cityMainTo}</h5>
                        </div>
                      </div>
                      <div class="row align-items-center">
                      <div class="col col-sm-auto"><span class="text-4">{flight.date} {flight.month} {flight.year}, {flight.day}</span></div>
                      <div class="col-auto"><span className={flight.isRefundable?"badge badge-success py-1 px-2 font-weight-normal text-1":"badge badge-danger py-1 px-2 font-weight-normal text-1"}>{flight.isRefundable?"Refundable":"Non-Refundable"}</span></div>
                      </div>
                    </div>
                    <div class="col-12 col-sm-3 col-lg-2 text-center text-sm-right mt-3 mt-sm-0"> <span class="text-dark text-7">₹{flight.publishedFare+markup}</span> <span class="text-1 text-muted d-block"></span> <span class="text-1 text-danger d-block"></span></div>
                    <div class="col-12 col-sm-3 col-lg-2 text-right ml-auto btn-book"> <a href="booking-flights-confirm-details.html" class="btn btn-sm btn-primary"><i class="fas fa-shopping-cart d-block d-lg-none"></i> <span class="d-none d-lg-block">Book</span></a> </div>
                  </div>
                  <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item"> <a class="nav-link active" id="first-tab" data-toggle="tab" href="#first" role="tab" aria-controls="first" aria-selected="true">Itinerary</a> </li>
                    <li class="nav-item"> <a class="nav-link" id="second-tab" data-toggle="tab" href="#second" role="tab" aria-controls="second" aria-selected="false">Fare Details</a> </li>
                    <li class="nav-item"> <a class="nav-link" id="third-tab" data-toggle="tab" href="#third" role="tab" aria-controls="third" aria-selected="false">Baggage Details</a> </li>
                    <li class="nav-item"> <a class="nav-link" id="fourth-tab" data-toggle="tab" href="#fourth" role="tab" aria-controls="fourth" aria-selected="false">Cancellation Fee</a> </li>
                  </ul>
                  <div class="tab-content my-3" id="myTabContent">
                  
      
                    <div class="tab-pane fade show active" id="first" role="tabpanel" aria-labelledby="first-tab">
                    
      {              
      flight.segArray.map(segment=>(
        
                    <div class="row flex-row pt-4 px-md-4">
                          <div class="col-12 col-sm-3 text-center d-lg-flex company-info"> <span class="align-middle"><img class="img-fluid" alt="" src="images/brands/flights/indigo.png"/> </span> <span class="align-middle ml-lg-2"> <span class="d-block text-1 text-dark"> {segment.AirlineName}</span> <small class="text-muted d-block">{segment.AirlineCode}-{segment.FlightNumber}</small> </span> </div>
                          <div class="col-12 col-sm-3 text-center time-info mt-3 mt-sm-0"> <span class="text-5 text-dark">{segment.depTime}</span> <small class="text-muted d-block">{segment.originAirportName}, {segment.origin}</small> </div>
                          <div class="col-12 col-sm-3 text-center time-info mt-3 mt-sm-0"> <span class="text-3 text-dark">{segment.hour}h {segment.min}m </span> <small class="text-muted d-block">Duration</small> </div>
                          <div class="col-12 col-sm-3 text-center time-info mt-3 mt-sm-0"> <span class="text-5 text-dark">{segment.arrTime}</span> <small class="text-muted d-block">{segment.destinationAirportName}, {segment.destination}</small> </div>
                    </div>
     
       )) }
                    </div>
                    
                    <div class="tab-pane fade" id="second" role="tabpanel" aria-labelledby="second-tab">
                      <div class="table-responsive-md">
                                     
      
                        <table class="table table-hover table-bordered bg-light">
                          <tbody>
                            <tr>
                              <td>Base Fare</td>
                              <td class="text-right">₹{flight.totalBaseFare}</td>
                            </tr>
                            <tr>
                              <td>Fees &amp; Surcharge</td>
                              <td class="text-right">₹{flight.totalTax}</td>
                            </tr>
                            <tr>
                              <td>Total</td>
                              <td class="text-right">₹{flight.publishedFare}</td>
                            </tr>
                          </tbody>
                        </table>
    
                      </div>
                      
                    </div>
                    
                    <div class="tab-pane fade" id="third" role="tabpanel" aria-labelledby="third-tab">
                      <div class="table-responsive-md">
                        <table class="table table-hover table-bordered bg-light">
                          <thead>
                            <tr>
                              <th>&nbsp;</th>
                              <td class="text-center">Cabin</td>
                              <td class="text-center">Check-In</td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Adult</td>
                              <td class="text-center">7 Kg</td>
                              <td class="text-center">15 Kg</td>
                            </tr>
                            <tr>
                              <td>Child</td>
                              <td class="text-center">7 Kg</td>
                              <td class="text-center">15 Kg</td>
                            </tr>
                            <tr>
                              <td>Infant</td>
                              <td class="text-center">0 Kg</td>
                              <td class="text-center">0 Kg</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="tab-pane fade" id="fourth" role="tabpanel" aria-labelledby="fourth-tab">
                      <table class="table table-hover table-bordered bg-light">
                        <thead>
                          <tr>
                            <th>&nbsp;</th>
                            <td class="text-center">Per Passenger Fee</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>24 hrs - 365 days</td>
                            <td class="text-center">$250 + $50</td>
                          </tr>
                          <tr>
                            <td>2-24 hours</td>
                            <td class="text-center">$350 + $50</td>
                          </tr>
                          <tr>
                            <td>0-2 hours</td>
                            <td class="text-center">$550 + $50</td>
                          </tr>
                        </tbody>
                      </table>
                      <p class="font-weight-bold">Terms & Conditions</p>
                      <ul>
                        <li>The penalty is subject to 4 hrs before departure. No Changes are allowed after that.</li>
                        <li>The charges are per passenger per sector.</li>
                        <li>Partial cancellation is not allowed on tickets booked under special discounted fares.</li>
                        <li>In case of no-show or ticket not cancelled within the stipulated time, only statutory taxes are refundable subject to Service Fee.</li>
                        <li>No Baggage Allowance for Infants</li>
                        <li>Airline penalty needs to be reconfirmed prior to any amendments or cancellation.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </Modal>  
    



      </div>
   </div>
)
}
</InfiniteScroll>:<></>
}

</div>
</div>
</div>):(<div style={{
    display: 'flex',
    flexDirection:"column",
    alignItems: 'center',
    justifyContent:"center",
    marginTop:50}}>
      <h1>Getting Your Flights.....</h1>
      <CircularProgress size={100}/></div>)
}
</section>
</div>


{loading?(
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
</footer>):(<></>)
}



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

export default OneWayFlightSearchDetails
