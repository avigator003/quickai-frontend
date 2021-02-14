import React, { useEffect, useState } from 'react'
import  $ from 'jquery'
import { CircularProgress } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Axios from 'axios'
import { useHistory } from 'react-router-dom';
function BookingFlightsConfirmDetails(props) {

  const history=useHistory();




  var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];

  var weekday = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat']
 

  const[flightData,setFlightData]=useState(props.location.state.data)
  const[loading,setLoading]=useState(false)
  const[flightDetails,setFlightDetails]=useState([]);
  const[insurance,setInsurance]=useState("yes")
  const[showRadio,setShowRadio]=useState(false)
  const[userDetails,setUserDetails]=useState([])
  const[email,setEmail]=useState();
  const[number,setNumber]=useState();
  const [adultList, setAdultList] = useState([{ title:"",firstName: "", lastName: "" }]);
  const [childrenList, setChildrenList] = useState([{ title:"",firstName: "", lastName: "" }]);
  const [infantList, setInfantList] = useState([{title:"", firstName: "", lastName: "" }]);

  const convertHour=(time)=>{
    var Hours = Math.floor(time /60)
    return Hours;
  }

  const convertMinute=(time)=>{
    var minutes = time % 60
    return minutes;
  }

useEffect(()=>{

    var resultIndex=props.location.state.resultIndex;
    var traceId=props.location.state.traceId;
    
        const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ClientId: "ApiIntegrationNew",
            UserName: "Vogues",
            Password: "Voguesapi@123",
            EndUserIp: "127.0.0.1"
                           })
               }
    fetch('http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate', requestOptions)
   .then(res=>res.json())
   .then(data=>{
    giveToken(data.TokenId,traceId,resultIndex)
  })
  
  
  
},[])
  


    const giveToken=(tokenId,traceId,resultIndex)=>{
     localStorage.setItem("traceId",traceId)
     localStorage.setItem("resultIndex",resultIndex)
     localStorage.setItem("tokenId",tokenId)
    const fare=async()=>{
    const Proxy_URL="https://cors-anywhere.herokuapp.com/";
    const URL="http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote";
  
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
    },  
      body: JSON.stringify({
          EndUserIp: "192.168.11.58",
          TokenId: tokenId,
          TraceId: traceId,
          ResultIndex: resultIndex
           })
  }
  
   await fetch(Proxy_URL+URL,requestOptions)
   
   .then(response=>response.json())
   .then(data=>{
       console.log(data,"data");
       
       var dat=data.Response.Results
       var segments=data.Response.Results.Segments[0];
       var segmentLength=data.Response.Results.Segments[0].length;


       var fullDate=new Date((segments[0].Origin.DepTime).substring(0,10));
       var date=fullDate.getDate();
       var month=months[fullDate.getUTCMonth()];
       var day=weekday[fullDate.getDay()];
       var year=(fullDate.getFullYear()).toString().substring(2,4);

       var mainDepTime=(segments[0].Origin.DepTime).substring(11,16);
       var mainArrTime=(segments[segmentLength-1].Destination.ArrTime).substring(11,16);
       var mainCityFrom=segments[0].Origin.Airport.CityName;
       var mainCityTo=segments[segmentLength-1].Destination.Airport.CityName;
       var mainAirportFrom=segments[0].Origin.Airport.AirportName;
       var mainAirportTo=segments[segmentLength-1].Destination.Airport.AirportName;
       var j;
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
          {origin:origin,dest0ination:destination,AirlineName:AirlineName,
           AirlineCode:AirlineCode,FlightNumber:FlightNumber,
           depTime:depTime,arrTime:arrTime,Duration:Duration,
           groundTime:groundTime,originAirportName:originAirportName,
           destinationAirportName:destinationAirportName,hour:hour,
           min:min
                 })
     }

     var durationArray=segArray.map(seg=>seg.Duration)
     var groundTimeArray=segArray.map(seg=>seg.groundTime)
     var totGroundTime=groundTimeArray.reduce((a,b)=>(a+=b),0)
     var totDuration=durationArray.reduce((a,b)=>(a+=b),0)
     var totalDuration=totGroundTime+totDuration
     var totalHours=convertHour(totalDuration);
     var totalMinutes=convertMinute(totalDuration)
     var flightDataArray=[];
     var totalBaseFare=dat.Fare.BaseFare;
     var totalTax=dat.Fare.Tax+dat.Fare.OtherCharges+dat.Fare.ServiceFee+dat.Fare.AdditionalTxnFeePub
     var publishedFare=dat.Fare.PublishedFare;
     var refundable=dat.IsRefundable;  
     if(parseInt(localStorage.getItem( 'adultCount' ))>0)
     {
     var adultCount= localStorage.getItem( 'adultCount' );
     var adultBaseFare=dat.FareBreakdown[0].BaseFare;
     }
     else{
      var adultCount=0
      var adultBaseFare=0
     }


      if(parseInt(localStorage.getItem( 'childrenCount' ))>0)
     {
     var childrenCount=localStorage.getItem( 'childrenCount' );
     var childrenBaseFare=dat.FareBreakdown[1].BaseFare
     }
     else{
      var childrenCount=0
      var childrenBaseFare=0
     }


     if(parseInt(localStorage.getItem( 'infantCount' ))>0)
     {
     var infantCount=localStorage.getItem( 'infantCount')
     var infantBaseFare=dat.FareBreakdown[2].BaseFare
     }
     else{

      var infantCount=0
      var infantBaseFare=0
     }
    
      flightDataArray.push({
      publishedFare:publishedFare,totalBaseFare:totalBaseFare,totalTax:totalTax,
      mainDepTime:mainDepTime,mainArrTime:mainArrTime,
      segArray:segArray,totalDuration:totalDuration,totalHours:totalHours,totalMinutes:totalMinutes,
      day:day,year:year,date:date,month:month,refundable:refundable,adultBaseFare:adultBaseFare,
      childrenBaseFare:childrenBaseFare,infantBaseFare:infantBaseFare,adultCount:adultCount,
      childrenCount:childrenCount,infantCount,infantCount, mainCityFrom: mainCityFrom, mainCityTo: mainCityTo
     })
      
      console.log(flightDataArray)
      setFlightDetails(flightDataArray)
      setFlightData(data)
      setLoading(true)
    })
  }
  fare();
  
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


      const handleInsurance=(e)=>{
        setShowRadio(!showRadio)
        setInsurance(e.target.value)
        }
 
        const handleAdultChange = (e, index) => {
          const { name, value } = e.target;
          const list = [...adultList];
          list[index][name] = value;
          setAdultList(list);
        };
         
        // handle click event of the Add button
        const handleAdultClick = (i) => {
          console.log("index",i)
          if(parseInt(localStorage.getItem('adultCount'))<=i+1)
          {
            alert("cannnot Add more adult now")
          }
          else{
          setAdultList([...adultList, { title:"",firstName: "", lastName: "" }]);
          }
        };

         
        const handleChildrenChange = (e, index) => {
          const { name, value } = e.target;
          const list = [...childrenList];
          list[index][name] = value;
          setChildrenList(list);
        };
         
        // handle click event of the Add button
        const handleChildrenClick = (i) => {
          if(parseInt(localStorage.getItem('childrenCount'))<=i+1)
          {
            alert("cannnot Add more Children now")
          }
          else{
          setChildrenList([...childrenList, { title:"",firstName: "", lastName: "" }]);
          }
        };

         
        const handleInfantChange = (e, index) => {
          const { name, value } = e.target;
          const list = [...infantList];
          list[index][name] = value;
          setInfantList(list);
        };
         
        // handle click event of the Add button
        const handleInfantClick= (i) => {
          if(parseInt(localStorage.getItem('infantCount'))<=i+1)
          {
            alert("cannnot Add more Infant now")
          }
          else{
          setInfantList([...infantList, { title:"",firstName: "", lastName: "" }]);
          }
        };



const paymentGateway=()=>{


  const fareQuote=async()=>{
    const Proxy_URL="https://cors-anywhere.herokuapp.com/";
    const URL="http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/FareQuote";
  
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},  
      body: JSON.stringify({
          EndUserIp: "192.168.11.58",
          TokenId: localStorage.getItem("tokenId"),
          TraceId: localStorage.getItem("traceId"),
          ResultIndex: localStorage.getItem("resultIndex")
           })
  }
  
   await fetch(Proxy_URL+URL,requestOptions)
   .then(response=>response.json())
   .then(data=>{
       console.log(data,"data");
       var am
       if(data.Response.IsPriceChanged)
       {
            am=data.Response.Results.Fare.PublishedFare
            alert("Priced Changed")
            console.log("price Changed")
       }
       else{
          am=insurance=="yes"?flightDetails[0].publishedFare+199:flightDetails[0].publishedFare
       }

       history.push({
        pathname: '/payment',
        state: { email:email, number:number,amount:am}} )
   })
       
}

fareQuote();
}




       

    return (
        <div>
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
            <h1>Flights - Confirm Details</h1>
          </div>
          <div class="col-md-4">
            <ul class="breadcrumb justify-content-start justify-content-md-end mb-0">
              <li><a href="index-2.html">Home</a></li>
              <li><a href="booking-flights.html">Flights</a></li>
              <li class="active">Flights Confirm Details</li>
            </ul>
          </div>
        </div>
      </div>
    </section>



{loading?(

  <div id="content">
    <section class="container">
      <>
        <div class="row">
          <div class="col-lg-8">
            <div class="bg-light shadow-md rounded p-3 p-sm-4 confirm-details">
              <h2 class="text-6 mb-3">Confirm Flight Details</h2>
             


        {
           flightDetails?.map(flight=>(
           flight.segArray.map(segment=>(
              <>
          <div class="card">
                <div class="card-header">
                  <div class="row align-items-center trip-title">
                    <div class="col-5 col-sm-auto text-center text-sm-left">
           <h5 class="m-0 trip-place">{segment.origin}</h5>
                    </div>
                    <div class="col-2 col-sm-auto text-8 text-black-50 text-center trip-arrow">➝</div>
                    <div class="col-5 col-sm-auto text-center text-sm-left">
                      <h5 class="m-0 trip-place">{segment.destination}</h5>
                    </div>
                    <div class="col-12 mt-1 d-block d-md-none"></div>
           <div class="col-6 col-sm col-md-auto text-3 date">{flight.date} {flight.month} {flight.year},{flight.day}</div>
                    <div class="col-6 col-sm col-md-auto text-right order-sm-1"><a class="text-1" data-toggle="modal" data-target="#fare-rules" href="#">Fare Rules</a></div>
           <div class="col col-md-auto text-center ml-auto order-sm-0"><span className={flight.refundable?"badge badge-success py-1 px-2 font-weight-normal text-1":"badge badge-danger py-1 px-2 font-weight-normal text-1"}>{flight.refundable?"Refundable":"Non-Refundable"}</span></div>
                  </div>
                </div>
                <div class="card-body">
                  <div class="row">
           <div class="col-12 col-sm-3 text-center text-md-left d-lg-flex company-info"> <span class="align-middle"><img class="img-fluid" alt="" src="images/brands/flights/indigo.png"/> </span> <span class="align-middle ml-lg-2"> <span class="d-block text-2 text-dark mt-1 mt-lg-0">{segment.AirlineName}</span> <small class="text-muted d-block">{segment.AirlineCode}-{segment.FlightNumber}</small> </span> </div>
           <div class="col-12 col-sm-3 text-center time-info mt-3 mt-sm-0"> <span class="text-5 text-dark">{segment.depTime}</span> <small class="text-muted d-block">{segment.originAirportName}, {segment.origin}</small> </div>
           <div class="col-12 col-sm-3 text-center time-info mt-3 mt-sm-0"> <span class="text-3 text-dark">{segment.hour}h {segment.min}m</span> <small class="text-muted d-block">Duration</small> </div>
           <div class="col-12 col-sm-3 text-center time-info mt-3 mt-sm-0"> <span class="text-5 text-dark">{segment.arrTime}</span> <small class="text-muted d-block">{segment.destinationAirportName}, {segment.destination}</small> </div>
                  </div>
                  <div id="fare-rules" class="modal fade" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title">Fare Rules</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>
                        </div>
                        <div class="modal-body">
                          <ul class="nav nav-tabs" id="departureTab" role="tablist">
                            <li class="nav-item"> <a class="nav-link active" id="third-tab" data-toggle="tab" href="#third" role="tab" aria-controls="third" aria-selected="false">Baggage Details</a> </li>
                            <li class="nav-item"> <a class="nav-link" id="fourth-tab" data-toggle="tab" href="#fourth" role="tab" aria-controls="fourth" aria-selected="false">Cancellation Fee</a> </li>
                          </ul>
                          <div class="tab-content my-3" id="departureContent">
                            <div class="tab-pane fade show active" id="third" role="tabpanel" aria-labelledby="third-tab">
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
                </div>
              </div>
              <br/>
              </>
         )) ))
        }


              <div class="alert alert-info mt-4"> <span class="badge badge-info">NOTE:</span> This is a special fare given by the airline. Airlines cancellation charges do apply. </div>
              <h2 class="text-6 mb-3 mt-5">Traveller Details - <span class="text-3"><a data-toggle="modal" data-target="#login-signup" href="#" title="Login / Sign up">Login</a> to book faster</span></h2>
              <p class="font-weight-600">Contact Details</p>
              <div class="form-row">
                <div class="col-sm-6 form-group">
                  <input class="form-control" id="email" required placeholder="Enter Email" type="text" value={email} onChange={event=>setEmail(event.target.value)}/>
                </div>
                <div class="col-sm-6 form-group">
                  <input class="form-control" data-bv-field="number" id="mobileNumber" required placeholder="Enter Mobile Number" type="text" value={number} onChange={event=>setNumber(event.target.value)}/>
                </div>
              </div>
              <p class="text-info">Your booking details will be sent to this email address and mobile number.</p>
              {
  parseInt(localStorage.getItem("adultCount"))==0?
  (<></>):
  (

  adultList.map((x,i)=>(
              <>
              <p class="font-weight-600">Adult {i+1}</p>
              
              <div class="form-row">
                  <div class="col-sm-2 form-group">
                  <select class="custom-select" id="title" name="title" value={x.title}  onChange={e => handleAdultChange(e, i)} required>
                    <option value="">Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                  </select>
                </div>
                <div class="col-sm-5 form-group">
                  <input class="form-control" id="firstName" required placeholder="Enter First Name" value={x.firstName}  name="firstName" onChange={e => handleAdultChange(e, i)} type="text"/>
                </div>
                <div class="col-sm-5 form-group">
                  <input class="form-control" data-bv-field="number" id="lastName" required placeholder="Enter Last Name" name="lastName" value={x.lastName}  onChange={e => handleAdultChange(e, i)} type="text"/>
                </div>
              </div>
            
              {
              
              parseInt(localStorage.getItem("adultCount"))!=i+1?(
              adultList.length - 1 === i &&           
              <button onClick style={{border:"none",color:"#0099FF",fontWeight:500,backgroundColor:"transparent"}} onClick={()=>handleAdultClick(i)}><AddIcon style={{fontSize:"15px"}}/>Add Adult</button>)
            :(<></>)
            }
            
              </>
)))}
<hr/>



{
  parseInt(localStorage.getItem("childrenCount"))==0?
  (<></>):
  (

  childrenList.map((x,i)=>(
              <>
              <p class="font-weight-600">Children {i+1} </p>
              <div class="form-row">
                <div class="col-sm-2 form-group">
                <select class="custom-select" id="title" name="title" value={x.title}  onChange={e => handleChildrenChange(e, i)} required="">
                    <option value="">Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                  </select>
                </div>
                <div class="col-sm-5 form-group">
                  <input class="form-control" id="firstName" required placeholder="Enter First Name" value={x.firstName} name="firstName" onChange={e => handleChildrenChange(e, i)} type="text"/>
                </div>
                <div class="col-sm-5 form-group">
                  <input class="form-control" data-bv-field="number" id="lastName" required placeholder="Enter Last Name" value={x.lastName} name="lastName" onChange={e => handleChildrenChange(e, i)} type="text"/>
                </div>
              </div>
              {
               parseInt(localStorage.getItem("childrenCount"))!=i+1?(
                  childrenList.length - 1 === i &&       
              <button style={{border:"none",color:"#0099FF",fontWeight:500,backgroundColor:"transparent"}}  onClick={()=>handleChildrenClick(i)}><AddIcon style={{fontSize:"15px"}}/>Add Children</button>
               ):(<></>)
               }
              </>
))
)}
<hr/>




{
  parseInt(localStorage.getItem("infantCount"))==0?
  (<></>):
  (


  infantList.map((x,i)=>(
              <>
              <p class="font-weight-600">Infant {i+1}</p>
              <div class="form-row">
                <div class="col-sm-2 form-group">
                <select class="custom-select" id="title" name="title" value={x.title}  onChange={e => handleInfantChange(e, i)} required="">
                    <option value="">Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                  </select>
                </div>
                <div class="col-sm-5 form-group">
                  <input class="form-control" id="firstName" required name="firstName" value={x.firstName} placeholder="Enter First Name" name="firstName" onChange={e => handleInfantChange(e, i)} type="text"/>
                </div>
                <div class="col-sm-5 form-group">
                  <input class="form-control" data-bv-field="number" id="lastName" name="lastName" value={x.lastName} required placeholder="Enter Last Name" name="lastName" onChange={e => handleInfantChange(e, i)} type="text"/>
                </div>
              </div>
              {
               parseInt(localStorage.getItem("infantCount"))!=i+1?(
              infantList.length - 1 === i &&       
              <button style={{border:"none",color:"#0099FF",fontWeight:500,backgroundColor:"transparent"}} onClick={()=>handleInfantClick(i)}><AddIcon style={{fontSize:"15px"}} />Add Infant</button>
               ):(<></>)}
              </>
))
  )}


            </div>
			
			
			
			
			
			<div class="bg-light shadow-md rounded p-3 p-sm-4 confirm-details mt-30">
              <h2 class="text-6 mb-3">Add-ons</h2>
              
              
             
              
              
              <h2 class="text-6 mb-3">Trip Protection Plans - <span class="text-3"><a data-toggle="modal" data-target="#login-signup" href="#" title="Login / Sign up">Login</a> to book faster</span></h2>
              <p class="mb-5">Get all the benefits for just ₹ 199 per traveller (18% GST included) <a href="#">Know more</a></p>
		
    
    {flightDetails?.map(flight=>( <p class="p-subhead">Valid for: {flight.mainCityFrom}- {flight.mainCityTo}</p>))}

				
              
			  <div class="form-row">
                <div class="col-sm-4 padd-10">
					<div class="border-01 padd-05 br-4">
						<div class="d-left"> <span class="align-middle"><img src="images/brands/flights/indigo.png"/> </span> </div>
						<div class="d-right"> <span class="text-5 text-dark">Claim Upto Rs 1L*</span> <small class="text-muted d-block">Emergency Medical</small> </div>
					</div>
                </div>
                <div class="col-sm-4 padd-10">
					<div class="border-01 padd-05 br-4">
						<div class="d-left"> <span class="align-middle"><img src="images/brands/flights/indigo.png"/> </span> </div>
						<div class="d-right"> <span class="text-5 text-dark">Claim upto Rs.20K*</span> <small class="text-muted d-block">Trip Cancellation</small> </div>
					</div>
                </div>
				<div class="col-sm-4 padd-10">
					<div class="border-01 padd-05 br-4">
						<div class="d-left"> <span class="align-middle"><img src="images/brands/flights/indigo.png"/> </span> </div>
						<div class="d-right"> <span class="text-5 text-dark">Claim upto Rs.5L*</span> <small class="text-muted d-block">Personal Accident</small> </div>
					</div>
                </div>
              </div>
			  
			  <div class="form-row mt-10">
                <div class="col-sm-12 form-group">
						<input type="radio" id="yes" name="trip" value="yes" checked={!showRadio} onChange={handleInsurance}/>
						<label for="yes">Yes, secure my trip,</label><br/>
						<span class="rad-text">I agree to the Terms & Conditions , and confirm that all passengers are above 2 years of age</span><br/>
						<input type="radio" id="no" name="trip" value="no" checked={showRadio} onChange={handleInsurance}/>
						<label for="no">No, I do not wish to secure my trip</label><br/>					
                </div>
              </div>
            </div>
			  </div>
          
{
flightDetails.map(flight=>(
          <aside class="col-lg-4 mt-4 mt-lg-0">
            <div class="bg-light shadow-md rounded p-3">
              <h3 class="text-5 mb-3">Fare Details</h3>
              <ul class="list-unstyled">
                <li class="mb-2">Base Fare <span class="float-right text-4 font-weight-500 text-dark">₹{flight.totalBaseFare}</span><br/>
                  <small class="text-muted">Adult : {flight.adultCount}, Child : {flight.childrenCount}, Infant : {flight.infantCount}</small></li>
                <li class="mb-2">Taxes & Fees <span class="float-right text-4 font-weight-500 text-dark">₹{flight.totalTax}</span></li>
                <li class="mb-2">Insurance <span class="float-right text-4 font-weight-500 text-dark">₹{insurance=="yes"?"199":"0"}</span></li>
              </ul>
              <div class="text-dark bg-light-4 text-4 font-weight-600 p-3"> Total Amount <span class="float-right text-6">₹{insurance=="yes"?flight.publishedFare+199:flight.publishedFare}</span> </div>
              <h3 class="text-4 mb-3 mt-4">Promo Code</h3>
              <div class="input-group form-group">
                <input class="form-control" placeholder="Promo Code" aria-label="Promo Code" type="text"/>
                <span class="input-group-append">
                <button class="btn btn-secondary" type="submit">APPLY</button>
                </span> </div>
              <ul class="promo-code pre-scrollable">
                <li><span class="d-block text-3 font-weight-600">FLTOFFER</span>Up to $500 Off on your booking. Hurry! Limited period offer. <a class="text-1" href="#">Terms & Conditions</a></li>
                <li><span class="d-block text-3 font-weight-600">HOTOFFER</span>Up to $500 Off on your booking. Hurry! Limited period offer. <a class="text-1" href="#">Terms & Conditions</a></li>
                <li><span class="d-block text-3 font-weight-600">SUMMEROFFER</span>Up to $500 Off on your booking. Hurry! Limited period offer. <a class="text-1" href="#">Terms & Conditions</a></li>
                <li><span class="d-block text-3 font-weight-600">BIGOFFER</span>Up to $500 Off on your booking. Hurry! Limited period offer. <a class="text-1" href="#">Terms & Conditions</a></li>
                <li><span class="d-block text-3 font-weight-600">FLTOFFER</span>Up to $500 Off on your booking. Hurry! Limited period offer. <a class="text-1" href="#">Terms & Conditions</a></li>
                <li><span class="d-block text-3 font-weight-600">FLTOFFER</span>Up to $500 Off on your booking. Hurry! Limited period offer. <a class="text-1" href="#">Terms & Conditions</a></li>
              </ul>
              <button class="btn btn-primary btn-block"   type="submit" onClick={paymentGateway} >Proceed To Payment</button>
            </div>
          </aside>
))}

          
        </div>
        </>
    </section>
  </div>
  
  
  ):(<div style={{
    display: 'flex',
    flexDirection:"column",
    alignItems: 'center',
    justifyContent:"center",
    marginTop:50}}>
      <h1>Progressing.....</h1>
      <CircularProgress size={100}/></div>
    
  )}




  
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
        </div>
    )
}

export default BookingFlightsConfirmDetails
