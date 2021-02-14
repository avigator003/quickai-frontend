import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Axios from 'axios';
import { Button } from '@material-ui/core';
import { useLocation } from 'react-router-dom';

const columns = [
  { id: 'Sno', label: 'S.No', minWidth: 20 },
  { id: 'agentName', label: 'Agent Name', minWidth: 150 },
  {
    id: 'companyName',
    label: 'Company Name',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'username',
    label: 'User name',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'bookingId',
    label: 'Booking Id',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'dateTime',
    label: 'Date and Time',
    align: 'center',
    minWidth:200,
  },
  {
    id: 'Debit',
    label: 'Debit',
    minWidth: 30,
    align: 'center',
  },

  {
    id: 'Credit',
    label: 'Credit',
    minWidth: 125,
    align: 'center',
  },



];


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function DistributorTransactions() {
    const location = useLocation();

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [distributors,setDistributors]=useState([])
  const[loading,setLoading]=useState(true)
  const[blocked,setBlocked]=useState()

   useEffect(()=>{
    const data=async()=>{
      Axios.post('http://localhost:8000/gettransactionbycompany' ,{
        company: location.state.company
      })
      .then(response=>{
        console.log(response.data)
          setDistributors((response.data).reverse())
         
        })
}
data();
 },[])




  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {distributors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,i) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      <TableCell key={i} align="center" style={{fontSize:13}}>{i+1}</TableCell>
                      <TableCell key={i} align="center" style={{fontSize:13}}>{row.AgentName}</TableCell>
                      <TableCell key={i} align="center" style={{fontSize:13}}>{row.CompanyName}</TableCell>
                      <TableCell key={i} align="center" style={{fontSize:13}}>{row.Username}</TableCell>
                      <TableCell key={i} align="center" style={{fontSize:13}}>{row.BookId}</TableCell>
                      <TableCell key={i} align="center"  style={{fontSize:13,width:10}}>{(new Date(row.DateTime)).toLocaleString()}</TableCell>
                      <TableCell key={i} align="center"><Button   style={{fontSize:10}}>{row.Debit}.00</Button></TableCell>
                      <TableCell key={i} align="center"><Button style={{fontSize:10}}>{row.Credit}.00</Button></TableCell>
                  
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={distributors.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
    
  );
}
