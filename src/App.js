import React,{ useEffect, useRef, useState } from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import './App.css';
import FlightSearch from './Flights/FilghtSearch'
import OneWayFlightSearchDetails from './Flights/OneWayFlightSearchDetails';
import TwoWayFlightSearchDetails from './Flights/TwoWayFlightSearchDetails'
import BookingFlightsConfirmDetails from './Flights/BookingFlightsConfirmDetails'
import Dashboard from './Dashboard/Dashboard'
import  $ from 'jquery'
import AdminFilghtSearch from './Dashboard/AdminFLightSearch/AdminFilghtSearch';
import AdminTwoWayFlightSearchDetails from './Dashboard/AdminFLightSearch/AdminTwoWayFlightSearchDetails';
import AdminOneWayFlightSearchDetails from './Dashboard/AdminFLightSearch/AdminOneWayFlightSearchDetails';
import Payment from './Flights/Payment/Payment';
import Markup from './Dashboard/Markup/Markup';
import Distributor from './Dashboard/Distributor/Distributor';
import DistributorList from './Dashboard/Distributor/DistributorList';
import DistributorCommision from './Dashboard/Distributor/DistributorCommision';
import AgentWallet from './Dashboard/UpdateAgentWallet/AgentWallet';
import Transactions from './Dashboard/Transactions/Transactions';
import Login from './Login/Login';
import SignUp from './Login/SignUp';
import DistributorProfile from './Dashboard/Distributor/DistributorProfile';
import DistributorTransactions from './Dashboard/Distributor/DistributorTransactions';


function App() {
  

  return (
    <Router>

<Switch>
<Route path="/login" component={Login}></Route>
<Route path="/register" component={SignUp}></Route>


<Route path="/flightsearch" component={FlightSearch}></Route>
<Route path="/onewayflights" component={OneWayFlightSearchDetails}></Route>
<Route path="/twowayflights" component={TwoWayFlightSearchDetails}></Route>
<Route path="/confirmflight" component={BookingFlightsConfirmDetails}></Route>
<Route path="/payment" component={Payment}></Route>


       <Route path="/adminflightsearch">
       <Dashboard title="Flight Search">
       <AdminFilghtSearch/>
       </Dashboard>
       </Route>

       
       <Route path="/adminonewayflightdeatails">
       <Dashboard title="One Way Flight Details">
       <AdminOneWayFlightSearchDetails/>
       </Dashboard>
       </Route>

       <Route path="/admintwowayflightdeatails">
       <Dashboard title="Two Way Flight Details">
       <AdminTwoWayFlightSearchDetails/>
       </Dashboard>
       </Route>


       <Route path="/adminconfirmdetails">
       <Dashboard title="Confirm Flight Details">
       <AdminOneWayFlightSearchDetails/>
       </Dashboard>
       </Route>


       <Route path="/addmarkup">
       <Dashboard title="Markup">
       <Markup/>
       </Dashboard >
       </Route>


       <Route path="/distributor">
       <Dashboard title="Add Distributor">
       <Distributor/>
       </Dashboard>
       </Route>


       <Route path="/distributorlist">
       <Dashboard title="Distributor List">
       <DistributorList/>
       </Dashboard>
       </Route>


       <Route path="/distributorcommision">
       <Dashboard title="Distributor Commission">
       <DistributorCommision/>
       </Dashboard>
       </Route>


       <Route path="/distributorprofile">
       <Dashboard title="Distributor Profile">
       <DistributorProfile/>
       </Dashboard>
       </Route>


       <Route path="/distributortransactionlist">
       <Dashboard title="Trnasaction Details">
       <DistributorTransactions/>
       </Dashboard>
       </Route>

       


       <Route path="/agentpayment">
       <Dashboard title="Agent Payment">
       <AgentWallet/>
       </Dashboard>
       </Route>


       <Route path="/transactions">
       <Dashboard title="Agent Transactions">
       <Transactions/>
       </Dashboard>
       </Route>

    </Switch>

   </Router>


  );
}

export default App;
