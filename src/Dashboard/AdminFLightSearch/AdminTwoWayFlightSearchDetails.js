import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import { useStateValue } from '../../ContextApi/StateProvider';
import { CircularProgress, Modal } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroll-component';

function AdminTwoWayFlightSearchDetails() {
    
  const[{flight},dispatch]=useStateValue();
  const[flightData,setFlightData]=useState([]);

  const[activePage,setActivePage]=useState(1);
  
  const[flightData1,setFlightData1]=useState([]);

  const[activePage1,setActivePage1]=useState(1);

  const[totalCount,setTotalCount]=useState(0);
  const[totalCount1,setTotalCount1]=useState(0);
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
  const[currentFlights1,setCurrentFlights1]=useState([])
  const[loading1,setLoading1]=useState(false)
  const[activeModal,setActiveModal]=useState(null)
  const[activeModal1,setActiveModal1]=useState(null)

  const[Resultindex,setResultindex]=useState()
  const[Resultindex1,setResultindex1]=useState()
  const[firstFlight,setFirstFlight]=useState();
  const[secondFlight,setSecondFlight]=useState();
  
  const handleRadioChange=(e)=>{
    var index=e.target.value
    const arr=flightData.filter(data=>data.resultIndex==index)
    setFirstFlight(arr)
    setResultindex(index)
  }

  const handleRadioChange1=(e)=>{
    var index=e.target.value
    const arr=flightData1.filter(data=>data.resultIndex==index)
    setSecondFlight(arr)
    setResultindex1(index)
  }


  const convertHour=(time)=>{
    var Hours = Math.floor(time /60)
  
    return Hours;
  }

  const convertMinute=(time)=>{
    var minutes = time % 60
    return minutes;
  }


  
const clickHandler=(e,index)=>{
  setActiveModal(index)
  }


  
const clickHandler1=(e,index)=>{
  setActiveModal1(index)
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




  const fetchMoreData= () => {
      
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




   const fetchMoreData1= () => {
      
    var pageNumber=activePage1+1;
    var indexOfLastFlight=pageNumber*6;
    var indexOfFirstFlight=indexOfLastFlight-6;
    setTimeout(() => {
    setCurrentFlights1(currentFlights1.concat(flightData1.slice(indexOfFirstFlight,indexOfLastFlight)
  ))
     }, 1500);
  
     setLoading1(true)
    setActivePage1(pageNumber)
   };

   
var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
"Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];


var weekday = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat']

useEffect(()=>{


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
      PreferredArrivalTime:localStorage.getItem( 'departDate' )+"T00: 00: 00"
      },
      {
        Origin: localStorage.getItem( 'to' ),
        Destination:localStorage.getItem( 'from' ),
        FlightCabinClass:localStorage.getItem( 'flightClass' ),
        PreferredDepartureTime: localStorage.getItem( 'returnDate' )+"T00: 00: 00",
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

    console.log(date,month,year,day)
    

    for(i=0;i<dataLength;i++)
    {
      var dat=data.Response.Results[0];
      var ResultIndex=dat[i].ResultIndex;
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
      resultIndex:ResultIndex
      
     })
     

    }

    console.log(flightDataArray)
    


    var indexOfLastFlight=activePage*6;
    var indexOfFirstFlight=indexOfLastFlight-6;
    var current=flightDataArray.slice(indexOfFirstFlight,indexOfLastFlight);
    

    setFlightData(flightDataArray)
    setCurrentFlights(current)
    setLoading(true)
  });
}

search();

},[])


useEffect(()=>{


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
        PreferredArrivalTime:localStorage.getItem( 'departDate' )+"T00: 00: 00"
        },
        {
          Origin: localStorage.getItem( 'to' ),
          Destination:localStorage.getItem( 'from' ),
          FlightCabinClass:localStorage.getItem( 'flightClass' ),
          PreferredDepartureTime: localStorage.getItem( 'returnDate' )+"T00: 00: 00",
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
      console.log("round trip")
      var dataLength=data.Response.Results[1].length;
      setTotalCount1(dataLength)
      var i;
      var flightDataArray=[];
      var fullDate=new Date(localStorage.getItem( 'returnDate' ));
      var date=fullDate.getDate();
      var month=months[fullDate.getUTCMonth()];
      var day=weekday[fullDate.getDay()];
      var year=(fullDate.getFullYear()).toString().substring(2,4);
  
      console.log(date,month,year,day)
      
  
      for(i=0;i<dataLength;i++)
      {
        var dat=data.Response.Results[1];
        var ResultIndex=dat[i].ResultIndex;
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
        resultIndex:ResultIndex
        
       })
       
  
      }
  
      console.log(flightDataArray)
      
  
  
      var indexOfLastFlight=activePage1*6;
      var indexOfFirstFlight=indexOfLastFlight-6;
      var current=flightDataArray.slice(indexOfFirstFlight,indexOfLastFlight);
      
  
      setFlightData1(flightDataArray)
      setCurrentFlights1(current)
      setLoading1(true)
    });
  }
  
  search();
  
  },[])
  

    return (
        <>
        <div id="main-wrapper">
        <div id="content">
          <section class="container">
              <div class="row">
                <div class="col mb-2">
                  <form id="bookingFlight" method="post">
                    <div class="mb-3">
                      <div class="custom-control custom-radio custom-control-inline">
                        <input id="oneway" name="flight-trip" class="custom-control-input" required type="radio"/>
                        <label class="custom-control-label" for="oneway">One Way</label>
                      </div>
                      <div class="custom-control custom-radio custom-control-inline">
                        <input id="roundtrip" name="flight-trip" class="custom-control-input" checked required type="radio"/>
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
                                <div class="input-group-prepend">
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
        
              
        { (loading & loading1)    ?(
        
              <div class="row">
                
                <aside class="col-md-3">
                  <div class="bg-light shadow-md rounded p-3">
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
                </aside>
                
                <div class="col-md-9 mt-4 mt-md-0">
                  <div class="bg-light shadow-md rounded py-4">
                    <div class="row no-gutters">
                    
                      <div class="col-6">
                        <div class="px-3">
                          <h2 class="text-5">{flightData[0].cityMainFrom} <small>to</small> {flightData[0].cityMainTo}</h2>
                        </div>
                        <div class="text-1 bg-light-3 border border-left-0 py-2 px-3">
                          <div class="form-row">
                            <div class="col col-sm col-lg-3 text-center d-none d-sm-block">Airline</div>
                            <div class="col-6 col-sm col-lg-3 text-center">Departure</div>
                            <div class="col-6 col-sm col-lg-3 text-center">Arrival</div>
                            <div class="col col-sm col-lg-3 text-right d-none d-sm-block">Price</div>
                          </div>
                        </div>
                       <div class="flight-list round-trip border-right">
        
        
        
        
        
        
        
        
                {currentFlights?
            <InfiniteScroll
                  dataLength={currentFlights.length}
                  next={fetchMoreData}
                  hasMore={true}
                  loader={<h4 style={{textAlign:"center",marginTop:30}}>Loading...</h4>}
                >
        
        {
          currentFlights.map((flight,index)=>
        
                          <div class="flight-item">
                            <div class="form-row align-items-center flex-row pt-4 pb-2 px-3">
                              <div class="col-12 col-sm col-lg-3 d-flex align-items-center text-center mb-2 mb-sm-0 company-info">
                                <div class="custom-control custom-radio custom-control-inline mr-1">
                                
                                  <input  name="departure-flight" value={flight.resultIndex} onChange={handleRadioChange}  checked={Resultindex==flight.resultIndex} type="radio"/>
          
                                </div>
                                <div class="d-block"> <img class="img-fluid" alt="" src="images/brands/flights/indigo.png"/> <span class="d-block text-1 text-dark">{flight.segArray[0].AirlineName}</span> </div>
                              </div>
                              <div class="col-6 col-sm col-lg-3 text-center time-info"> <span>{flight.mainDepTime}</span> <small class="text-muted d-none d-sm-block">{flight.stopage==0?"Non Stop":flight.stopage+" Stop"}</small> </div>
                              <div class="col-6 col-sm col-lg-3 text-center time-info"> <span>{flight.mainArrTime}</span> <small class="text-muted d-none d-sm-block">18h 55m</small> </div>
                              <div class="col-12 col-sm col-lg-3 text-center text-sm-right text-dark text-4 price">₹{flight.publishedFare}</div>
                              <div class="col col-sm-auto col-lg-3 ml-auto text-0 text-center text-sm-right"><a style={{cursor:"pointer",color:"#0E7FD9"}} onClick={e => clickHandler(e, index)}>Flight Details</a></div>
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
                                        <div class="col-12 col-sm-9 col-lg-10">
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
                                            <div class="col-auto"><span class="badge badge-success py-1 px-2 font-weight-normal text-1">{flight.isRefundable?"Refundable":"Non-Refundable"}</span></div>
                                          </div>
                                        </div>
                                        <div class="col-12 col-sm-3 col-lg-2 text-center text-sm-right mt-3 mt-sm-0"> <span class="text-dark text-7 price">₹{flight.publishedFare} </span> <span class="text-1 text-muted d-block">(Per Adult)</span> <span class="text-1 text-danger d-block">2 seat(s) left</span></div>
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
                                            <div class="col-12 col-sm-3 text-center d-lg-flex company-info"> <span class="align-middle"><img class="img-fluid" alt="" src="images/brands/flights/indigo.png"/> </span> <span class="align-middle ml-lg-2"> <span class="d-block text-1 text-dark">{segment.AirlineName}</span> <small class="text-muted d-block">{segment.AirlineCode}-{segment.FlightNumber}</small> </span> </div>
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
        )
        }
        </InfiniteScroll>:<></>
        }
        
        
        
        
        
        
        
                          
                        </div>
                      </div>
        
        
        
                      <div class="col-6">
                        <div class="px-3">
                          <h2 class="text-5">{flightData1[0].cityMainFrom} <small>to</small> {flightData1[0].cityMainTo}</h2>
                        </div>
                        <div class="text-1 bg-light-3 border border-right-0 border-left-0 py-2 px-3">
                          <div class="form-row">
                            <div class="col col-sm col-lg-3 text-center d-none d-sm-block">Airline</div>
                            <div class="col-6 col-sm col-lg-3 text-center">Departure</div>
                            <div class="col-6 col-sm col-lg-3 text-center">Arrival</div>
                            <div class="col col-sm col-lg-3 text-right d-none d-sm-block">Price</div>
                          </div>
                        </div>
        
                        
        
        
                      {currentFlights1?
            <InfiniteScroll
                  dataLength={currentFlights1.length}
                  next={fetchMoreData1}
                  hasMore={true}
                  loader={<h4 style={{textAlign:"center",marginTop:30}}>Loading...</h4>}
                >
        
        {
          currentFlights1.map((flight,index)=>
        
                        <div class="flight-list round-trip">
                          <div class="flight-item">
                            <div class="form-row align-items-center flex-row pt-4 pb-2 px-3">
                              <div class="col-12 col-sm col-lg-3 d-flex align-items-center text-center mb-2 mb-sm-0 company-info">
                                <div class="custom-control custom-radio custom-control-inline mr-1">
                                  <input id="returns-flight1" value={flight.resultIndex} onChange={handleRadioChange1}  checked={Resultindex1==flight.resultIndex}  type="radio"/>
                                </div>
                                <div class="d-block"> <img class="img-fluid" alt="" src="images/brands/flights/jetairways.png"/> <span class="d-block text-1 text-dark">{flight.segArray[0].AirlineName}</span> </div>
                              </div>
                              <div class="col-6 col-sm col-lg-3 text-center time-info"> <span>{flight.mainDepTime}</span> <small class="text-muted d-none d-sm-block">{flight.stopage==0?"Non Stop":flight.stopage+" Stop"}</small> </div>
                              <div class="col-6 col-sm col-lg-3 text-center time-info"> <span></span>{flight.mainArrTime}<small class="text-muted d-none d-sm-block">{flight.totalHours==0?"":flight.totalHours+"h"} {flight.totalMinutes==0?"":flight.totalMinutes+"m"}</small> </div>
                              <div class="col-12 col-sm col-lg-3 text-center text-sm-right text-dark text-4 price">₹{flight.publishedFare}</div>
                              <div class="col col-sm-auto col-lg-3 ml-auto text-0 text-center text-sm-right"><a style={{cursor:"pointer",color:"#0E7FD9"}} onClick={e => clickHandler1(e, index)} >Flight Details</a></div>
                            </div>  
        
                            <Modal id={index} open={activeModal1==index}>
                
                              <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                                <div class="modal-content">
                                  <div class="modal-header">
                                    <h5 class="modal-title">Flight Details</h5>
                                    <button type="button" class="close" onClick={()=>setActiveModal1(null)}> <span aria-hidden="true">&times;</span> </button>
                                  </div>
                                  <div class="modal-body">
                                    <div class="flight-details">
                                      <div class="row mb-4">
                                        <div class="col-12 col-sm-9 col-lg-10">
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
                                            <div class="col-auto"><span class="badge badge-success py-1 px-2 font-weight-normal text-1">{flight.isRefundable?"Refundable":"Non-Refundable"}</span></div>
                                          </div>
                                        </div>
                                        <div class="col-12 col-sm-3 col-lg-2 text-center text-sm-right mt-3 mt-sm-0"> <span class="text-dark text-7 price">₹{flight.publishedFare}</span> <span class="text-1 text-muted d-block"></span> <span class="text-1 text-danger d-block"></span></div>
                                      </div>
                                      <ul class="nav nav-tabs" id="returnmyTab2" role="tablist">
                                        <li class="nav-item"> <a class="nav-link active" id="returnfirst-tab2" data-toggle="tab" href="#returnfirst2" role="tab" aria-controls="first2" aria-selected="true">Itinerary</a> </li>
                                        <li class="nav-item"> <a class="nav-link" id="returnsecond-tab2" data-toggle="tab" href="#returnsecond2" role="tab" aria-controls="second2" aria-selected="false">Fare Details</a> </li>
                                        <li class="nav-item"> <a class="nav-link" id="returnthird-tab2" data-toggle="tab" href="#returnthird2" role="tab" aria-controls="third2" aria-selected="false">Baggage Details</a> </li>
                                        <li class="nav-item"> <a class="nav-link" id="returnfourth-tab2" data-toggle="tab" href="#returnfourth2" role="tab" aria-controls="fourth2" aria-selected="false">Cancellation Fee</a> </li>
                                      </ul>
                                      <div class="tab-content my-3" id="returnmyTabContent2">
                                        <div class="tab-pane fade show active" id="returnfirst2" role="tabpanel" aria-labelledby="returnfirst-tab2">
                                        {              
              flight.segArray.map(segment=>(
                
                                          <div class="row flex-row pt-4 px-md-4">
                                            <div class="col-12 col-sm-3 text-center d-lg-flex company-info"> <span class="align-middle"><img class="img-fluid" alt="" src="images/brands/flights/jetairways.png"/> </span> <span class="align-middle ml-lg-2"> <span class="d-block text-1 text-dark"> {segment.AirlineName}</span> <small class="text-muted d-block">{segment.AirlineCode}-{segment.FlightNumber}</small> </span> </div>
                                            <div class="col-12 col-sm-3 text-center time-info mt-3 mt-sm-0"> <span class="text-5 text-dark">{segment.depTime}</span> <small class="text-muted d-block">{segment.originAirportName}, {segment.origin}</small> </div>
                                            <div class="col-12 col-sm-3 text-center time-info mt-3 mt-sm-0"> <span class="text-3 text-dark"></span> {segment.hour}h {segment.min}m <small class="text-muted d-block">Duration</small> </div>
                                            <div class="col-12 col-sm-3 text-center time-info mt-3 mt-sm-0"> <span class="text-5 text-dark">{segment.arrTime}</span> <small class="text-muted d-block">{segment.destinationAirportName}, {segment.destination}</small> </div>
                                          </div>
              ))}
                                        </div>
                                        <div class="tab-pane fade" id="returnsecond2" role="tabpanel" aria-labelledby="returnsecond-tab2">
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
                                        <div class="tab-pane fade" id="returnthird2" role="tabpanel" aria-labelledby="returnthird-tab2">
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
                                        <div class="tab-pane fade" id="returnfourth2" role="tabpanel" aria-labelledby="returnfourth-tab2">
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
                    
                    
                  </div>
                </div>
        
        
                <div class="round-trip-fare fixed-bottom bg-dark shadow-md text-light">
                  <div class="container p-2 p-sm-4">
                    <div class="row align-items-center">
                        <div class="col-2"></div>
                      <div class="col-7">
                        <div class="row">
                          
                       {firstFlight?.map(flight=>
                          <div class="col-12 col-sm-6 border-right border-dark">
                            <div class="row align-items-center flex-row">
                              <div class="col col-sm-4 col-md-3 text-center d-lg-flex company-info"> <span class="align-middle d-none d-sm-block"><img class="img-fluid" alt="" src="images/brands/flights/indigo.png"/> </span> <span class="align-middle ml-lg-2"> <span class="d-block text-1">{flight.segArray[0].AirlineName}</span> 
                              {
                            flight.segArray.map(segment=>(
                            <small class="text-white-50 d-block">{segment.AirlineCode}-{segment.FlightNumber}</small>))}
                               </span> </div>
                              <div class="col col-sm-4 col-md-3 text-center time-info"> <span class="text-4">{flight.mainDepTime}</span> <small class="text-white-50 d-none d-lg-block">{flight.cityMainFrom}</small> </div>
                              <div class="col col-sm-4 col-md-3 text-center time-info"> <span class="text-4">{flight.mainArrTime}</span> <small class="text-white-50 d-none d-lg-block">{flight.cityMainTo}</small> </div>
                              <div class="col-md-3 text-center d-none d-md-block time-info"> <span class="text-1">{flight.totalHours==0?"":flight.totalHours+"h"} {flight.totalMinutes==0?"":flight.totalMinutes+"m"}</span> <small class="text-white-50 d-block">{flight.stopage==0?"Non Stop":flight.stopage+" Stop"}</small> </div>
                            </div>
                          </div>
                         )}
                         
                          <div class="col-12 d-block d-sm-none">
                            <hr class="my-1 border-dark"/>
                          </div>
                          
                       {secondFlight?.map(flight=>
                          <div class="col-12 col-sm-6 border-right border-dark">
                            <div class="row align-items-center flex-row">
                              <div class="col col-sm-4 col-md-3 text-center d-lg-flex company-info"> <span class="align-middle d-none d-sm-block"><img class="img-fluid" alt="" src="images/brands/flights/spicejet.png"/> </span> <span class="align-middle ml-lg-2"> <span class="d-block text-1">{flight.segArray[0].AirlineName}</span> 
                              {
                               flight.segArray.map(segment=>(
                              <small class="text-white-50 d-block">{segment.AirlineCode}-{segment.FlightNumber}</small> ))}
                              </span> </div>
                              <div class="col col-sm-4 col-md-3 text-center time-info"> <span class="text-4">{flight.mainDepTime}</span> <small class="text-white-50 d-none d-lg-block">{flight.cityMainFrom}</small> </div>
                              <div class="col col-sm-4 col-md-3 text-center time-info"> <span class="text-4">{flight.mainArrTime}</span> <small class="text-white-50 d-none d-lg-block">{flight.cityMainTo}</small> </div>
                              <div class="col-md-3 text-center d-none d-md-block time-info"> <span class="text-1">{flight.totalHours==0?"":flight.totalHours+"h"} {flight.totalMinutes==0?"":flight.totalMinutes+"m"}</span> <small class="text-white-50 d-block">{flight.stopage==0?"Non Stop":flight.stopage+" Stop"}</small> </div>
                            </div>
                          </div>
                       )}
                        </div>
                      </div>
                      <div class="col-3">
                        <div class="row align-items-center">
                          <div class="col-12 col-md-6 text-light text-center text-6 price"><span class="text-1 text-white-50 d-none d-lg-block">Total Fare: </span>$1946</div>
                          <div class="col-12 col-md-6 text-center mt-2 mt-md-0 btn-book"> <a href="booking-flights-confirm-details.html" class="btn btn-sm btn-primary px-sm-2 px-lg-3"><i class="fas fa-shopping-cart d-block d-lg-none"></i> <span class="d-none d-lg-block">Book Now</span></a> </div>
                        </div>
                      </div>
                    </div>
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
        
        </div>
            
        </>
        
        
    )
}

export default AdminTwoWayFlightSearchDetails
