import { Grid } from '@material-ui/core'
import { Card } from 'antd'
import Axios from 'axios'
import React ,{useState,useEffect} from 'react'

function DashboardPage() {
   const [distributorNumber,setDistributorNumber]=useState()
   const[loading,setLoading]=useState(true)
  useEffect(() => {
    const data = async () => {
      Axios.get('http://localhost:8000/getdistributor')
        .then(response => {
          console.log(response.data)
          setDistributorNumber(response.data.length)
          setLoading(false)
       })
    }

    data();
  }, [])
    return (
        <div>
            {!loading &&
            <Grid container justify="space-around" spacing={2}  >
                <Grid item xs={4}>
                    <Card style={{backgroundColor:"#17A2B8"}}>
                        <p>Agents</p>
                        <p>{distributorNumber}</p>
                    </Card>
                </Grid>

                <Grid item xs={4}>
                    <Card  style={{backgroundColor:"#DC3545"}}>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </Grid>

                <Grid item xs={4}>
                    <Card  style={{backgroundColor:"#FFC107"}}>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </Grid>

            </Grid>
}
        </div>
    )
}

export default DashboardPage

