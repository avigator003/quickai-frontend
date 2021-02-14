import React,{useState} from 'react'
import Axios from 'axios';
import { notification } from "antd";
import { ToastContainer, toast } from 'react-toastify';

const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );
  
  const validNameRegex = RegExp(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u);

const validNumberRegex = RegExp(/^[0-9]+$/u);


function Distributor() {

    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        city:"",
        state:"",
        address:"",
        postalCode:"",
        companyName:"",
        openingValue:"",
        gstNumber:"",
        password:""

      });
      const [error, setError] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        city:"",
        state:"",
        address:"",
        postalCode:"",
        companyName:"",
        openingValue:"",
        gstNumber:"",
        password:"",

      });
    
     
  const [display, setDisplay] = useState(false);

  const AddDistributor=(e)=>{
    if(!display){
      const validateForm = (error) => {
        let valid = true;
        Object.values(error).forEach((val) => val.length > 0 && (valid = false));
        return valid;
      };
      if (validateForm(error)) {
        checkValidity();
      } else {
        setDisplay(true)
        toast.error("Failed to Add")
      }
    }
  







  function checkValidity() {
    if (!Object.keys(state).every((k) => state[k] !== "")) {
      setDisplay(true)
      toast.error("Fields Should Not Be Empty")
        
    } 
       else {
          Axios.post('http://localhost:8000/adddistributor', {
            FirstName: state["firstName"],
            LastName: state["lastName"],
            MobileNumber:state[" phoneNumber"],
            Email:state["email"],
            CompanyName:state["companyName"],
            Address:state["address"],
            City:state["city"],
            State:state["state"],
            PinCode:state["postalCode"],
            IsBlocked:false,
            Commission:0,
            OpeningValue:state["openingValue"],
            GSTNumber:state["gstNumber"],
            password:state["password"]
                })
          .then(function (response) {
              setState({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                city:"",
                state:"",
                address:"",
                postalCode:"",
                companyName:"",
                openingValue:"",
                gstNumber:"",
                password:""
        
              })
           toast.success("Successful saved")
            })
          .catch(function (error) {
            console.log(error);
          });
      }
    
    }
  }









  const handleChange = (e) => {
    e.persist();
    setDisplay(false)
    const { name, value } = e.target;
    let errors = error;
    switch (name) {
      case "firstName":
        errors.firstName =
            (value.length == 0) 
            ? "Required" 
            : (!validNameRegex.test(value))
            ? "First Name must be in characters!"
            : (value.length > 20) 
            ? "First Name must be less than 20 characters long!" 
            : "";
       break;
      case "lastName":
        errors.lastName =
          (value.length == 0) 
          ? "Required" 
          : (!validNameRegex.test(value))
          ? "Last Name must be in characters!"
          : (value.length > 20) 
          ? "Last Name must be less than 20 characters long!" 
          : "";
        break;
      case "email":
        errors.email = validEmailRegex.test(value)
          ? ""
          : "Email is not valid!";
        break;
      
      case "phoneNumber":
        errors.phoneNumber =
          value.length < 10 || value.length > 13
            ? "Contact Number number must be between 10 and 13 digits"
            : "";
        break;
      case "address":
        errors.address =
        value.length <=0  ? "Address is Required" : "";
        break;
        case "city":
        errors.city =
          value.length <=0  ? "City is Required" : "";
        break;
        case "postalCode":
        errors.postalCode =
          value.length < 6 || value.length > 6 ? "Postal Code must be at least 6 digits" : "";
        break;
        case "state":
        errors.state =
         value.length <=0  ? "State is Required" : "";
        break;
        case "companyName":
        errors.companyName =
          value.length <= 0 ? "Company Name is Required" : "";
        break;
        
        case "openingValue":
        errors.openingValue = validNumberRegex.test(value)
        ? ""
        : "Opening Value Must be in Digits!";
  
        break;
        
        case "gstNumber":
        errors.gstNumber =
          value.length < 15 ||  value.length>15  ? "Gst Number must be 15 Characters Only" : "";
        break;
      default:
        break;
    }
    setError({ ...errors });
    setState((st) => ({ ...st, [e.target.name]: e.target.value }));
    console.log("state",state)
    console.log("eroor",errors)
  };








    return (
        <div className="container py-5">
    <div className="row">
        <div className="col-md-10 mx-auto">
            <form >
                <div className="form-group row">
                    <div className="col-sm-6">
                        <label for="inputFirstname">First name</label>
                        <input type="text" className="form-control" 
                        name="firstName"
                        id="inputFirstname" placeholder="First name"  required
                        value={state["firstName"]} onChange={handleChange}/>
                        <p className="help-block text-danger">
                          {error.firstName}
                        </p>
                    
                    </div>
                    <div className="col-sm-6">
                        <label for="inputLastname">Last name</label>
                        <input type="text" className="form-control" name="lastName"
                         id="inputLastname" placeholder="Last name"  value={state["lastName"]} onChange={handleChange}/>
                        <p className="help-block text-danger">
                          {error.lastName}
                        </p>
                   
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-6">
                        <label for="inputAddressLine1">Email</label>
                        <input type="email" className="form-control" name="email"
                         id="inputAddressLine1" placeholder="Email"  value={state["email"]} onChange={handleChange}/>
                       <p className="help-block text-danger">
                          {error.email}
                        </p>
                   
                    </div>
                    <div className="col-sm-6">
                        <label for="inputAddressLine1">Password</label>
                        <input type="number" className="form-control" name="password"
                         id="password" placeholder="password"  value={state["password"]} onChange={handleChange}/>
                        <p className="help-block text-danger">
                          {error.password}
                        </p>
                   
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-6">
                        <label for="inputCity">City</label>
                        <input type="text" className="form-control" id="inputCity" name="city"
                         placeholder="City" value={state["city"]} onChange={handleChange} />
                        <p className="help-block text-danger">
                          {error.city}
                        </p>
                   
                    </div>
                    <div className="col-sm-3">
                        <label for="inputState">State</label>
                        <input type="text" className="form-control" name="state"
                         id="inputState" placeholder="State" value={state["state"]} onChange={handleChange}/>
                      <p className="help-block text-danger">
                          {error.state}
                        </p>
                   
                    </div>
                    <div className="col-sm-3">
                        <label for="inputPostalCode">Postal Code</label>
                        <input type="text" className="form-control" id="inputPostalCode" name="postalCode"
                         placeholder="Postal Code"  value={state["postalCode"]} onChange={handleChange}/>
                     <p className="help-block text-danger">
                          {error.postalCode}
                        </p>
                   
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-6">
                        <label for="inputContactNumber">Contact Number</label>
                        <input type="number" className="form-control"  name="phoneNumber"
                        id="inputContactNumber" placeholder="Contact Number"  value={state["phoneNumber"]} onChange={handleChange}/>
                        <p className="help-block text-danger">
                          {error.phoneNumber}
                        </p>
                   
                    </div>
                    <div className="col-sm-6">
                        <label for="inputWebsite">Company Name</label>
                        <input type="text" className="form-control" id="inputWebsite" name="companyName"
                         placeholder="Company Name"  value={state["companyName"]} onChange={handleChange}/>
                        <p className="help-block text-danger">
                          {error.companyName}
                        </p>
                   
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-6">
                        <label for="inputAddressLine1">Opening Value</label>
                        <input type="number" className="form-control" name="openingValue"
                         id="openingValue" placeholder="Opening Value"  value={state["openingValue"]} onChange={handleChange}/>
                        <p className="help-block text-danger">
                          {error.openingValue}
                        </p>
                   
                    </div>
                    <div className="col-sm-6">
                        <label for="inputAddressLine2">GST Number </label>
                        <input type="text" className="form-control" name="gstNumber"
                         id="gstNumber" placeholder="GST" value={state["gstNumber"]} onChange={handleChange}/>
                      <p className="help-block text-danger">
                          {error.gstNumber}
                        </p>
                   
                    </div>
                </div>
              
                <div className="form-group row">
                  
                <div className="col-sm-12">
                        <label for="inputAddressLine2">Address </label>
                        <input type="text" className="form-control" name="address"
                         id="inputAddressLine2" placeholder="Address" value={state["address"]} onChange={handleChange}/>
                       <p className="help-block text-danger">
                          {error.address}
                        </p>
                   
                    </div>
               
                  </div>
                <div className="form-group row">
                <div className="col-sm-4">
                   
                </div>
                    <div className="col-sm-4">
           
                <button type="button" style={{width:"100%"}} className="btn btn-primary px-4 " onClick={()=>AddDistributor()}>Save</button>
       
                </div>
                <div className="col-sm-4">
                   
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
    )
}

export default Distributor
