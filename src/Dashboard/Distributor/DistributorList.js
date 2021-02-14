import React, { useState, useEffect } from 'react';
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

import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@material-ui/core';
import { Select } from 'antd'
import "antd/dist/antd.css";
import { Link, useHistory } from 'react-router-dom';
const columns = [
  { id: 'Sno', label: 'S.No', minWidth: 20 },
  { id: 'company', label: 'Company', minWidth: 150,
  align: 'center', },
  {
    id: 'clientName',
    label: 'Client Name',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'openingValue',
    label: 'Opening Value',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'commission',
    label: 'Commission',
    minWidth: 150,
    align: 'center',
  },
  {
    id: 'profile',
    label: 'Profile',
    minWidth: 30,
    align: 'center',
  },

  {
    id: 'action',
    label: 'Action',
    minWidth: 125,
    align: 'center',
  },

  {
    id: 'block',
    label: 'Block',
    minWidth: 40,
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

export default function DistributorList() {
  const { Option } = Select;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [distributors, setDistributors] = useState([])
  const [loading, setLoading] = useState(true)
  const [blocked, setBlocked] = useState()

const history=useHistory();

  useEffect(() => {
    const data = async () => {
      Axios.get('http://localhost:8000/getdistributor')
        .then(response => {
          console.log(response.data)
          setDistributors(response.data)
          setLoading(false)
        })
    }

    data();
  }, [])

  const viewHandler = (id) => {
    history.push({
        pathname: '/distributorprofile',
        state: { id:id }
    });
 };

 const handleCommision=(id)=>{
  history.push({
    pathname: '/distributorcommision',
    state: { id:id }
});
}

const handleReport=(company)=>{
  history.push({
    pathname: '/distributortransactionlist',
    state: { company:company }
});
}



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const handleBlock = (value, id) => {

    var block
    console.log(value)
    setBlocked(value)
    if (value === "YES") {
      block = true
    }
    else if (value === "NO") {
      block = false
    }
    Axios.put(`http://localhost:8000/adddistributorcommission/${id}`, {
      IsBlocked: block
    })
      .then(function (response) {
        if (block == false) {
          toast.warning("Successful Unblocked")
        }
        else {
          toast.error("Successful Blocked")
        }
      })
      .catch(function (error) {
        console.log(error);
      });


  }

  return (
    <>
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
              {distributors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    <TableCell key={i} align="center" style={{ fontSize: 13 }}>{i + 1}</TableCell>
                    <TableCell key={i} align="center" style={{ fontSize: 13 }}>{row.CompanyName}</TableCell>
                    <TableCell key={i} align="center" style={{ fontSize: 13 }}>{row.FirstName} {row.LastName}</TableCell>
                    <TableCell key={i} align="center" style={{ fontSize: 13 }}>{row.Email}</TableCell>
                    <TableCell key={i} align="center" style={{ fontSize: 13 }}>₹{row.OpeningValue}</TableCell>
                    <TableCell key={i} align="center" style={{ fontSize: 13 }}>
                    <Button style={{ fontSize: 10 }} onClick={()=>handleCommision(row._id)}>
                      Set Commission
                      </Button></TableCell>
                    <TableCell key={i} align="center">
                       <Button style={{ fontSize: 10 }} onClick={()=>viewHandler(row._id)}>View</Button>
                  </TableCell>
                    <TableCell key={i} align="center"><Button style={{ fontSize: 10 }} onClick={()=>handleReport(row.CompanyName)}>
                      View Report</Button></TableCell>
                    <TableCell key={i} align="center">
                      <Select defaultValue={row.IsBlocked ? "YES" : "NO"} style={{ width: 120 }} onChange={value => handleBlock(value, row._id)}>
                        <Option value="YES" selected={blocked === "YES" ? true : false}>Yes</Option>
                        <Option value="NO" selected={blocked === "NO" ? true : false}>No</Option>

                      </Select>
                    </TableCell>

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
      <ToastContainer
        position="top-right"
        style={{ marginTop: 70 }}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
