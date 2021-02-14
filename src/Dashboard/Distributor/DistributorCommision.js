import React,{useState,useEffect} from 'react'
import Axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';


function DistributorCommision() {

    const[commission,setCommission]=useState()
    const[id,setId]=useState()
    const[distributor,setDistributors]=useState([])
    const[loading,setLoading]=useState(true)
    const location = useLocation();

    useEffect(()=>{
        console.log(location.state.id,"idjf")
        if(location.state.id)
            setId(location.state.id)
        

        const data=async()=>{
          Axios.get('http://localhost:8000/getdistributor')
        .then(response=>{
          var distributorList=[]

          response.data.map(dat=>{
              distributorList.push({company:dat.CompanyName,email:dat.Email,name:dat.FirstName,id:dat._id})
          })
         console.log("list",distributorList)
         setDistributors(distributorList)
         setLoading(false)
   })
    }
    
    data();
     },[])
    



  const SetDistributorCommmsion=()=>{
        Axios.put(`http://localhost:8000/adddistributorcommission/${id}`, {
        Commission:commission
            })
         .then(function (response) {
         toast.success("Successful Set Commision")
        })
      .catch(function (error) {
        console.log(error);
      });
  }
    return (
        <div className="container py-5">
    <div className="row">
        <div className="col-md-10 mx-auto">
            <form >
                <div className="form-group row">
                    <div className="col-sm-6">
                    <label for="sel1">Select list:</label>
                        <select class="form-control" id="sel1" value={id} onChange={e=>setId(e.target.value)}>
                            <option value="" selected disabled>Select Distributor</option>
                            {
                                distributor.map(dis=>(
                              <option value={dis.id}>{dis.company} | {dis.email} | {dis.name}</option>
                              ))}
                         </select>
                     </div>
                    <div className="col-sm-6">
                        <label for="inputLastname">Commission</label>
                        <input type="text" className="form-control" id="inputWebsite"
                         placeholder="Commission"  value={commission} onChange={e=>setCommission(e.target.value)}/>
                    
                     </div>
                </div>
                <button type="button" className="btn btn-primary px-4 float-right" onClick={()=>SetDistributorCommmsion()}>Save</button>
            </form>
            <ToastContainer
                position="top-right"
                style={{marginTop:70}}
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                />
        
        </div>
    </div>
</div>
    )
}

export default DistributorCommision
