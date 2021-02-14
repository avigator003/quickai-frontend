import Axios from 'axios';
import React,{useState,useEffect} from 'react'
import { Card, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

function DistributorProfile(props) {
    const location = useLocation();

 const[user,setUser]=useState()
 const[loading,setLoading]=useState(true)
useEffect(()=>{
    console.log("id",location.id)
    const getUser=async()=>{
    Axios.get(`http://localhost:8000/getdistributorbyid/${location.state.id}`)
    .then(function (response) {
        setUser(response.data[0])
        console.log(response.data[0])
        setLoading(false)
    })
}
getUser();
},[])

    return (
        <>
        {
        !loading &&
        <div>
            <Card.Body className="px-0 py-2">
      <Table responsive hover>
        <tbody>
          <tr className="unread">
            <td>First Name</td>
            <td>{user.FirstName}</td>
          </tr>
          <tr className="unread">
            <td>Last Name</td>
            <td>{user.LastName}</td>
          </tr>
          <tr className="unread">
            <td>Email Address</td>
            <td>{user.Email}</td>
          </tr>
          <tr className="unread">
            <td>Comapny Name</td>
            <td>{user.CompanyName}</td>
          </tr>

          <tr className="unread">
            <td>Address</td>
            <td>{user.Address},{user.City}-{user.PinCode},{user.State}</td>
          </tr>
          <tr className="unread">
            <td>GST NUmber</td>
            <td>{user.GSTNumber}</td>
         </tr>
         <tr className="unread">
            <td>Opening Value</td>
            <td>₹{user.OpeningValue}</td>
         </tr>
        </tbody>
      </Table>
    </Card.Body>
        </div>
        }
        </>
    )
}

export default DistributorProfile
