import React,{useState,useEffect} from 'react'
import { Card } from 'antd';
import { ToastContainer,toast } from 'react-toastify';
import Select from 'react-select';
import Axios from 'axios';
function AgentWallet() {
     
    const[user,setUser]=useState();
    
    const[userName,setUserName]=useState();
    const[balance,setBalance]=useState(0);
    const[userList,setUserList]=useState([]);

    useEffect(()=>{
        const data=async()=>{
          Axios.get('http://localhost:8000/getdistributor')
         .then(response=>{
             var array=[]
             response.data.map(user=>{
             array.push({ value: user._id, label:user.Email})
             })
             console.log("arrrya",array)
             setUserList(array)
        })
    }
    
    data();
     },[])
    

    const  handleChange = option => {
        console.log(option.value)
        setUser(option.value)
        setUserName(option)
      };

     const updateDistributorBalance=()=>{
        if(user==null||user==""|| user==undefined)
        {
            
     toast.error("Please Select User")
        }
       else if(balance==null||balance==""|| balance==undefined)
        {
            
      toast.error("Please Fill Balance")
        }
        else{
         Axios.get(`http://localhost:8000/getdistributorbyid/${user}`)
         .then(function (response) {
             var bal=parseInt(balance).toFixed(2)
             Axios.put(`http://localhost:8000/updatedistributorbalance/${user}`, {
              Balance:balance
              })
            Axios.post('http://localhost:8000/addtransaction', {
                AgentName: response.data[0].FirstName+" "+response.data[0].LastName,
                CompanyName: response.data[0].CompanyName,
                Username:response.data[0].Email,
                BookId:"",
                DateTime:new Date(),
                Credit:bal,
                Debit:0
                })
              .then(function (response) {
                  setBalance("")
                  setUser("")
                  setUserName("")
               toast.success("Successful saved")
                })
              .catch(function (error) {
                console.log(error);
              });
    })
  .catch(function (error) {
    console.log(error);
  });
}
}
      
    return (
        <Card title=""  style={{backgroundColor:"#FFFFFF",borderRadius:10,padding:5}}>
   
    <Card
      style={{ marginTop: 16 }}
      type="inner"
    >

<div className="container ">
    <div className="row">
        <div className="col-md-10">
            <form >
                <div className="form-group row">
                    <div className="col-sm-6">
                        <label for="inputFirstname">Select Agent</label>
  
                        <Select
                    placeholder="Agent....."
                    value={userName}
                    onChange={handleChange}
                    options={userList}
                    />                    
                    </div>
                  </div>
                <div className="form-group row">
                    <div className="col-sm-6">
                        <label for="inputAddressLine1">Balance</label>
                        <input type="number" className="form-control" name="balance"
                         id="inputAddressLine1" placeholder="Balance"  value={balance} onChange={(e)=>setBalance(e.target.value)}/>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-6">
             
                <button type="button" className="btn btn-primary px-4 " onClick={()=>updateDistributorBalance()}>Submit</button>
                </div>
                </div>
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






    </Card>
  </Card>
    )
}

export default AgentWallet
