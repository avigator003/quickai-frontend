import React,{useState,useEffect}from 'react'
import { Button,Modal } from 'react-bootstrap'
import AddIcon from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Select from 'react-select';
import { Input } from '@material-ui/core';
import Axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
  
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);




const options = [
    { value: 'Air', label: 'Air' },
  ];

  
const flighttypeoptions = [
    { value: 'All', label: 'All' },
    { value: 'Domestic', label: 'Domestic' },
    { value: 'International', label: 'International' },
  ];

  var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];

  var weekday = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat']
 


  const useStyles = makeStyles({
    table: {
      minWidth: 700,
    },
  });


function Markup() {
    const classes = useStyles();

    const[show,setShow]=useState(false)
    const[selectedProduct,setSelectedProduct]=useState()
    const[selectedType,setSelectedType]=useState()
    const[amount,setAmount]=useState()
    const[markupData,setMarkupData]=useState()
    const[created,setCreated]=useState([])
    const[showData,setShowData]=useState(false)
    const[editId,setEditId]=useState()
    const [update,setUpdate]=useState(false)
	const handleClose=()=> {
        setShow(false)
	}

  const handleShow1=()=> {
    setUpdate(false)
    setSelectedProduct()
    setSelectedType()
    setAmount("")
    setShow(true)
}

	const handleShow=()=> {
    setUpdate(true)
        setShow(true)
	}


     const  handleChange = option => {
        setSelectedProduct(option)
      };

      
     const  handleflighttype = option => {
       console.log(option)
        setSelectedType(option)
      };



      useEffect(()=>{
        const getMarkup=async()=>{
          Axios.get('http://localhost:8000/getmarkup')
            .then(response=>{
              console.log(response.data)
              if(response.data.length>0)
              {
              setMarkupData(response.data[0])
              var date=new Date(response.data[0].CreatedOn)
              var datee=date.getDate();
              console.log(datee)
              var month=months[date.getMonth()]
              var year=date.getFullYear()
              var array=[]
              array.push({date:datee,month:month,year:year,time:date.toLocaleTimeString().substring(0,5)+""+date.toLocaleTimeString().substring(9,12)})
              setCreated(array)
              setShowData(true)
              }
              
            })
        }
        getMarkup();
        
      },[])

      const AddMarkup=()=>{
       var date=new Date();
       console.log(date.toUTCString(),"date")
        Axios.get('http://localhost:8000/getmarkup')
          .then(response=>{
            
            if(response.data.length==0 || response.data===null || response.data.length==undefined)
            {
                Axios.post('http://localhost:8000/addmarkup', {
                    ProductType: selectedProduct.label,
                    Amount: amount,
                    MarkupType: selectedType.label,
                    AmountType:"Fixed",
                    CreatedOn:date,
                    Airline:"ALL",
                    PaxTypes:"",
                      })
                  .then(function (response) {
                toast.success("Successful saved")
                handleClose()
                setSelectedType("")
                setSelectedProduct("")
                setAmount()
                getMarkup();
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            }
            else{
                setSelectedType("")
                setSelectedProduct("")
                setAmount()
                handleClose()
                toast.error("Duplicate Elements cant be added");
                
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        }
      
    const getMarkup=async()=>{
      Axios.get('http://localhost:8000/getmarkup')
        .then(response=>{
          setMarkupData(response.data[0])
          var date=new Date(response.data[0].CreatedOn)
          var datee=date.getDate();
          console.log(datee)
          var month=months[date.getMonth()]
          var year=date.getFullYear()
          var array=[]
          array.push({date:datee,month:month,year:year,time:date.toLocaleTimeString().substring(0,5)+""+date.toLocaleTimeString().substring(9,12)})
          setCreated(array)
          setShowData(true)
        })
    }
      

const deleteMarkup=()=>{
  const del=async()=>{
  Axios.get('http://localhost:8000/deletemarkup')
  .then(response=>{
    setShowData(false)
    
    toast.info("Deleted Successfully")
  })
}
    del();  
}

const editMarkup=(id)=>{
  console.log("editing",id)
   handleShow()
   setEditId(id)
   setSelectedProduct({value:markupData.ProductType,label:markupData.ProductType})
   console.log("am",markupData.MarkupType)
   setAmount(markupData.Amount)
   setSelectedType({value:markupData.MarkupType,label:markupData.MarkupType})

}

const updateMarkup=(id)=>{
  var date=new Date();
 const update=async()=>{
    Axios.post(`http://localhost:8000/editmarkup/${editId}`, {
      ProductType: selectedProduct.label,
      Amount: amount,
      MarkupType: selectedType.label,
      AmountType:"Fixed",
      CreatedOn:date,
      Airline:"ALL",
      PaxTypes:"",
        })
    .then(function (response) {
  toast.warn("Successful Updated")
  handleClose()
  setSelectedType("")
  setSelectedProduct("")
  setAmount()
  getMarkup();
    })
    .catch(function (error) {
      console.log(error);
    });
}
update(); 
}





    return (
        <div>
        <Button variant="primary" onClick={handleShow1} style={{borderRadius:50,marginBottom:15}}>
	         Add Markup <AddIcon/>
        </Button>
        

				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Markup</Modal.Title>
					</Modal.Header>
					<Modal.Body>
                        
                    <Select
                    placeholder="Product Name....."
                    value={selectedProduct}
                    onChange={handleChange}
                    options={options}
                    />
                   
                   <input placeholder="Markup Amount" type="number" 
                   value={amount} onChange={(e)=>setAmount(e.target.value)}
                   style={{width:"100%",borderRadius:3,height:38,
                    outlineColor:"#2684FF",border:"1px solid #B3B3B3",marginTop:20,
                    paddingLeft:10,marginBottom:20}}/>


                   <Select
                    placeholder="Flight Type....."
                    value={selectedType}
                    onChange={handleflighttype}
                    options={flighttypeoptions}
                    />
                 
                    </Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
                    </Button>
                    {
                      !update?
						<Button variant="primary" onClick={AddMarkup}>
							Add Markup
            </Button>:
            	<Button variant="primary" onClick={updateMarkup}>
							Update Markup
            </Button>
}

					</Modal.Footer>
				</Modal>
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
        

{/* Markup Table*/ }
{
  showData?
<TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Created On</StyledTableCell>
            <StyledTableCell align="right">Product</StyledTableCell>
            <StyledTableCell align="right">Markup Type</StyledTableCell>
            <StyledTableCell align="right">Airline</StyledTableCell>
            <StyledTableCell align="right">Pax Types</StyledTableCell>
            <StyledTableCell align="right">Amount Type</StyledTableCell>
            <StyledTableCell align="right">Value</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
            <StyledTableCell align="center">Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
           
            <StyledTableRow >
              <StyledTableCell component="th" scope="row">
               {created[0]?.month} {created[0]?.date},{created[0]?.year} {created[0]?.time}
              </StyledTableCell>
              <StyledTableCell align="center">{markupData.ProductType}</StyledTableCell>
              <StyledTableCell align="center">{markupData.MarkupType}</StyledTableCell>
              <StyledTableCell align="center">{markupData.Airline}</StyledTableCell>
              <StyledTableCell align="center">{markupData.PaxTypes}</StyledTableCell>
              
              <StyledTableCell align="center">{markupData.AmountType}</StyledTableCell>
              <StyledTableCell align="center">₹{markupData.Amount}</StyledTableCell>
              
              <StyledTableCell align="center"><Button onClick={()=>editMarkup(markupData._id)}><Edit/></Button></StyledTableCell>
              <StyledTableCell align="center"><Button onClick={()=>deleteMarkup()}><Delete /></Button></StyledTableCell>
            </StyledTableRow>
        
        </TableBody>
      </Table>
    </TableContainer>:<></>

          }

                </div>
    )
}

export default Markup
