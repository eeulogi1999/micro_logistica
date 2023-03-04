// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import { Box, Button, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

function getData(fi, ff) {
  return fetch('/api/server' + '?fi=' + fi + '&ff=' + ff)
    .then(res => res.json())
    .then(data => {
      return data
    })
}

const AddCard = props => {
  const theme = useTheme()
  const [p, setP] = useState({ fi: dayjs('2023-01-01'), ff: dayjs('2023-03-01') })

  const [rows, setRows] = useState(
    async () =>
      await getData(p.fi.$d.toLocaleString('af-ZA').split(' ')[0], p.ff.$d.toLocaleString('af-ZA').split(' ')[0])
  )

  const columns = [
    { field: 'age_id', headerName: 'AGE', type: 'number', widht: 80, align: 'left', headerAlign: 'center' },
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
        <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='FECHA INICIO'
              value={p.fi}
              inputFormat='DD-MM-YYYY'
              onChange={e => {
                setP({ ...p, fi: e })
              }}
              renderInput={params => <TextField {...params} />}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='FECHA FIN'
              value={p.ff}
              inputFormat='DD-MM-YYYY'
              onChange={e => {
                setP({ ...p, ff: e })
              }}
              renderInput={params => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Button
            onClick={async () => {
              setRows(
                await getData(
                  p.fi.$d.toLocaleString('af-ZA').split(' ')[0],
                  p.ff.$d.toLocaleString('af-ZA').split(' ')[0]
                )
              )
            }}
            variant='contained'
          >
            FILTRAR
          </Button>
        </Grid>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} getRowId={row => row.age_id} columns={columns} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default AddCard
