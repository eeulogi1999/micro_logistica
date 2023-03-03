// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'

const AddCard = props => {
  const theme = useTheme()

  const [rows, setRows] = useState(() => props.listcom)

  const columns = [
    { field: 'age_id', headerName: 'AGE', type: 'number', widht: 80 },
    {
      field: 'mde_age_id',
      headerName: 'AGENTE',
      headerAlign: 'center',
      type: 'string',
      minWidht: 230,
      flex: 1,
      renderCell: p => {
        return p.row.mde_age_id.age_gpe_id.gpe_nombre + ', ' + p.row.mde_age_id.age_gpe_id.gpe_apellidos
      }
    },
    {
      field: '4',
      headerName: 'COBRE BRILLANTE',
      headerAlign: 'center',
      type: 'number',
      valueFormatter: p => {
        return parseFloat(p.value ?? 0).toFixed(2)
      },
      align: 'right',
      flex: 1
    },
    {
      field: '5',
      headerName: 'COBRE GRUESO',
      headerAlign: 'center',
      type: 'number',
      valueFormatter: p => {
        return parseFloat(p.value ?? 0).toFixed(2)
      },
      align: 'right',
      flex: 1
    },
    {
      field: '6',
      headerName: 'COBRE DELGADO',
      headerAlign: 'center',
      type: 'number',
      valueFormatter: p => {
        return parseFloat(p.value ?? 0).toFixed(2)
      },
      align: 'right',
      flex: 1
    },
    {
      field: '8',
      headerName: 'COBRE TELEFONICO',
      headerAlign: 'center',
      type: 'number',
      valueFormatter: p => {
        return parseFloat(p.value ?? 0).toFixed(2)
      },
      align: 'right',
      flex: 1
    },
    {
      field: '11',
      headerName: 'BRONCE LIMPIO',
      headerAlign: 'center',
      type: 'number',
      valueFormatter: p => {
        return parseFloat(p.value ?? 0).toFixed(2)
      },
      align: 'right',
      flex: 1
    },
    {
      field: '19',
      headerName: 'GRUPO AUTOMOTRIZ',
      headerAlign: 'center',
      type: 'number',
      valueFormatter: p => {
        return parseFloat(p.value ?? 0).toFixed(2)
      },
      align: 'right',
      flex: 1
    },
    {
      field: '23',
      headerName: 'ALUMINIO DURO',
      headerAlign: 'center',
      type: 'number',
      valueFormatter: p => {
        return parseFloat(p.value ?? 0).toFixed(2)
      },
      align: 'right',
      flex: 1
    },
    {
      field: '24',
      headerName: 'ALUMINIO PERFIL',
      headerAlign: 'center',
      type: 'number',
      valueFormatter: p => {
        return parseFloat(p.value ?? 0).toFixed(2)
      },
      align: 'right',
      flex: 1
    }
  ]

  return (
    <Card>
      <CardContent>
        <Grid item xs={12} sm={12} sx={{ p: 2, order: { sm: 1, xs: 2 } }}>
          <DataGrid autoHeight rows={rows} getRowId={row => row.age_id} hideFooter={true} columns={columns} />
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AddCard

export const getServerSideProps = async () => {
  const { data: listcom } = await axios.get('https://sistema.companycacel.com/Gerencial/getListComisiones', {
    headers: {
      gcl_id: '1',
      alm_id: '1',
      periodo: '2023-01',
      Authorization: 'Basic YWRtaW5AY29tcGFueWNhY2VsLmNvbTpxd2VydA=='
    }
  })

  return {
    props: {
      listcom
    }
  }
}
