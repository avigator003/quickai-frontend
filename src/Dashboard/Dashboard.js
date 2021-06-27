import React, { useEffect, useState } from 'react'
import { useStateValue } from '../ContextApi/StateProvider';
import firebase from 'firebase'
import Modal from '@material-ui/core/Modal'
import { Button, createMuiTheme, Input, makeStyles, TextField, ThemeProvider, withStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import $ from 'jquery'
import '../Flights/FlightSearch.css'
import { Link, useHistory } from 'react-router-dom';





function Dashboard(props) {
const history=useHistory();

    return (
     <div class="wrapper">

  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars" style={{fontSize:30}}></i></a>
      </li>
      <li class="nav-item" style={{fontSize:20,fontWeight:800,marginLeft:30,marginTop:10}}>
        {props.title}
     </li>
      </ul>

    <ul class="navbar-nav ml-auto">
      
      
      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#">
          <i class="far fa-bell"></i>
          <span class="badge badge-warning navbar-badge">15</span>
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <span class="dropdown-item dropdown-header">15 Notifications</span>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item">
            <i class="fas fa-envelope mr-2"></i> 4 new messages
            <span class="float-right text-muted text-sm">3 mins</span>
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item">
            <i class="fas fa-users mr-2"></i> 8 friend requests
            <span class="float-right text-muted text-sm">12 hours</span>
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item">
            <i class="fas fa-file mr-2"></i> 3 new reports
            <span class="float-right text-muted text-sm">2 days</span>
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
        </div>
      </li>
      
    </ul>
  </nav>

  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    
    <a href="index3.html" class="brand-link">
      <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{opacity: .8}}/>
      <span class="brand-text font-weight-light">Travel Vogues</span>
    </a>

    
    <div class="sidebar">
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image"/>
        </div>
        <div class="info">
          <a href="#" class="d-block">Anish Kumar</a>
        </div>
      </div>

      <div class="form-inline">
        <div class="input-group" data-widget="sidebar-search">
          <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search"/>
          <div class="input-group-append">
            <button class="btn btn-sidebar">
              <i class="fas fa-search fa-fw"></i>
            </button>
          </div>
        </div>
      </div>

      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
         
        <li class="nav-item">
            <Link to="/dashboard" class="nav-link">
              <i class="nav-icon fas fa-tachometer-alt"></i>
              <p>
                Dashboard
              </p>
            </Link>
          </li>
          <li class="nav-item ">
            <a href="#" class="nav-link ">
              <i class="nav-icon fas fa-fighter-jet"></i>
              <p>
                Flights
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul className="nav nav-treeview" >
              <li className="nav-item"  >
                <a onClick={()=>{history.push('/adminflightsearch')}} className="nav-link " >
                  <i class="fas fa-caret-right nav-icon"></i>
                  <p>Flights Booking</p>
                </a>
              </li>
              <li class="nav-item">
                <a onClick={()=>{history.push('/adminflightdetails')}} className="nav-link ">
                  <i class="fas fa-caret-right nav-icon"></i>
                  <p>Flights History</p>
                </a>
              </li>
            
            </ul>
          </li>
          <li class="nav-item">
            <Link to="/addmarkup" class="nav-link">
              <i class="nav-icon fas fa-bookmark"></i>
              <p>
                Markup
              </p>
            </Link>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="nav-icon fas fa-user-plus"></i>
              <p>
                Distributors
                <i class="fas fa-angle-left right"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <Link to="/distributor" class="nav-link">
                   <i class="fas fa-caret-right nav-icon"></i>
                  <p>Add Distributor</p>
                </Link>
              </li>
              <li class="nav-item">
              <Link to="/distributorcommision" class="nav-link">
             <i class="fas fa-caret-right nav-icon"></i>
                  <p>Distibutor Commission</p>
                </Link>
              </li>
              <li class="nav-item">
              <Link to="/distributorlist" class="nav-link">
                <i class="fas fa-caret-right nav-icon"></i>
                  <p>Distributor List</p>
                </Link>
              </li>
             </ul>
          </li>
       

          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="nav-icon fas fa-credit-card"></i>
              <p>
                 Payment
                <i class="fas fa-angle-left right"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <Link to="/agentpayment" class="nav-link">
                   <i class="fas fa-caret-right nav-icon"></i>
                  <p>Add Agent Payment</p>
                </Link>
              </li>
             </ul>
          </li>


          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="nav-icon fas fa-stamp"></i>
              <p>
                 Transactions
                <i class="fas fa-angle-left right"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <Link to="/transactions" class="nav-link">
                   <i class="fas fa-caret-right nav-icon"></i>
                  <p>Agent Transactions</p>
                </Link>
              </li>
             </ul>
          </li>








        </ul>
      </nav>
      
    </div>
  </aside>



  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-12">
              
             <div class="hero-wrap py-4 py-md-5" >
      

      <div class="hero-content py-0 py-lg-3" >
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              
             {props.children}

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
    
  <aside class="control-sidebar control-sidebar-dark">
  </aside>
 </div>

    )
}

export default Dashboard
