// ** React Imports
import { useState, forwardRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import TableRow from '@mui/material/TableRow'
import Collapse from '@mui/material/Collapse'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
import { styled, alpha, useTheme } from '@mui/material/styles'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Custom Component Imports
import Repeater from 'src/@core/components/repeater'
import Image from 'next/image'

// **addes eeulopgio19999
import logo_cacel from '/public/images/logos/logo_cacel.png'
import { DataGrid } from '@mui/x-data-grid'

const CustomInput = forwardRef(({ ...props }, ref) => {
  return (
    <TextField
      size='small'
      inputRef={ref}
      sx={{ width: { sm: '250px', xs: '170px' }, '& .MuiInputBase-input': { color: 'text.secondary' } }}
      {...props}
    />
  )
})

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1, 0)} !important`
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const RepeatingContent = styled(Grid)(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-1.5rem',
    position: 'absolute'
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.secondary
  },
  [theme.breakpoints.down('lg')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))

const RepeaterWrapper = styled(CardContent)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(5.5),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(12)
  }
}))

const InvoiceAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

const CustomSelectItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.success.main,
  backgroundColor: 'transparent !important',
  '&:hover': { backgroundColor: `${alpha(theme.palette.success.main, 0.1)} !important` }
}))
const now = new Date()
const tomorrowDate = now.setDate(now.getDate() + 7)

//** add */

const AddCard = props => {
  // ** Props
  const { clients, invoiceNumber, selectedClient, setSelectedClient, toggleAddCustomerDrawer } = props

  // ** States
  const [count, setCount] = useState(1)
  const [selected, setSelected] = useState('')
  const [issueDate, setIssueDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date(tomorrowDate))

  // ** Hook
  const theme = useTheme()

  // ** Deletes form
  const deleteForm = e => {
    e.preventDefault()

    // @ts-ignore
    e.target.closest('.repeater-wrapper').remove()
  }

  // ** Handle Invoice To Change
  const handleInvoiceChange = event => {
    setSelected(event.target.value)
    if (clients !== undefined) {
      setSelectedClient(clients.filter(i => i.name === event.target.value)[0])
    }
  }

  const handleAddNewCustomer = () => {
    toggleAddCustomerDrawer()
  }

  //AADD DATATABLES
  const defaultRows = [
    { mde_id: 1, mde_bie_id: 'Snow', mde_q: 23, mde_p: 23, mde_importe: 234 },
    { mde_id: 2, mde_bie_id: 'Lannister', mde_q: 45, mde_p: 12, mde_importe: 234 }
  ]

  const [id, setId] = useState(() => Math.max(...defaultRows.map(x => x['mde_id'])) + 1)

  const [rows, setRows] = useState(() => defaultRows)

  function getImporte(params) {
    return (params.row.mde_q ?? 0) * (params.row.mde_p ?? 0)
  }

  function setImporte(params) {
    const mde_p = (params.value ?? 0) / (params.row.mde_q ?? 1)

    return { ...params.row, mde_p }
  }

  const handleAddRow = () => {
    setId(id + 1)
    setRows(prevRows => [...prevRows, { mde_id: id, mde_bie_id: '', mde_q: 1, mde_p: 1, mde_importe: 1 }])
  }

  const handleDeleteRow = () => {
    console.log()

    // setRows(prevRows => {
    //   let rows = prevRows;
    //   delete prevRows[]

    //   return [...rows.slice(0, rowToDeleteIndex), ...rows.slice(rowToDeleteIndex + 1)]
    // })
  }

  const columns = [
    { field: 'mde_id', headerName: 'NRO', editable: true, flex: 1 },
    { field: 'mde_bie_id', headerName: 'MATERIAL', editable: true, flex: 1 },
    { field: 'mde_q', headerName: 'CANTIDAD', editable: true, flex: 1 },
    { field: 'mde_p', headerName: 'PRECIO', editable: true, flex: 1 },
    {
      field: 'mde_importe',
      headerName: 'IMPORTE',
      flex: 1,
      alignItems: 'flex-end',
      editable: true,
      valueGetter: getImporte,
      valueSetter: setImporte,
      sortComparator: (v1, v2) => v1.toString().localeCompare(v2.toString())
    }
  ]

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xl={4} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
            <Image src={logo_cacel} alt='logo cacel' width={'200'} priority />
          </Grid>
          <Grid item xl={4} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 700, lineHeight: 1.2 }}>
                {'COMPANY CACEL SAC'}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant='body2'>
                  Mza. o Lote. 17 Asc. Villa Universitaria (Grifo Repsol) LIMA - LIMA - LOS OLIVOS
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  SUCURSAL:Mz A, lote 12, tambo Inga, Ref. km 27 Panam. Norte- PUENTE PIEDRA
                </Typography>
                <Typography variant='body1'>CONTACTOS</Typography>
                <Typography variant='body2'>https://companycacel.com/</Typography>
                <Typography variant='body2'>companycacelsac@gmail.com</Typography>
                <Typography variant='body2'>+51 922 012 611 +51 922 532 641</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xl={4} xs={12}>
            <Box
              sx={{
                m: 4,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: 1,
                borderRadius: '10px'
              }}
            >
              <Typography variant='body1' sx={{ mb: 5, fontWeight: 700, lineHeight: 1.2 }}>
                RUC 20602849172
              </Typography>
              <Typography variant='body1' sx={{ mb: 5, fontWeight: 700, lineHeight: 1.2 }}>
                NOTA DE ENTRADA
              </Typography>
              <Typography variant='body1' sx={{ mb: 1, color: 'red', fontSize: 23, fontWeight: 700, lineHeight: 1.2 }}>
                NE01-00000100
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ my: theme => `${theme.spacing(1)} !important` }} />

      <CardContent sx={{ pb: 2 }}>
        <Grid container>
          <Grid item xs={12} sm={4} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary' }}>
              Agente:
            </Typography>
            <Select fullWidth size='small' value={selected} onChange={handleInvoiceChange} sx={{ mb: 4 }}>
              <CustomSelectItem value='' onClick={handleAddNewCustomer}>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', '& svg': { mr: 2 } }}>
                  <Icon icon='mdi:plus' fontSize={20} />
                  Nuevo
                </Box>
              </CustomSelectItem>
              {clients !== undefined &&
                clients.map(client => (
                  <MenuItem key={client.name} value={client.name}>
                    {client.name}
                  </MenuItem>
                ))}
            </Select>
            {selectedClient !== null && selectedClient !== undefined ? (
              <div>
                <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                  {selectedClient.company}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                  DIRECCION: {selectedClient.address}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                  CONTACOTO{selectedClient.contact}
                </Typography>
                <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                  CORREO:{selectedClient.companyEmail}
                </Typography>
              </div>
            ) : null}
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mb: { lg: 0, xs: 4 } }}></Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: 'flex', flexDirection: 'column', justifyContent: ['flex-start', 'flex-end'] }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant='subtitle2'>Moneda</Typography>
              <Select fullWidth size='small' value={selected} onChange={handleInvoiceChange} sx={{ mb: 4 }}>
                <CustomSelectItem value='' onClick={handleAddNewCustomer}></CustomSelectItem>
                {clients !== undefined &&
                  clients.map(client => (
                    <MenuItem key={client.name} value={client.name}>
                      {client.name}
                    </MenuItem>
                  ))}
              </Select>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant='subtitle2'>FECHA:</Typography>
              <DatePicker
                id='issue-date'
                selected={issueDate}
                customInput={<CustomInput />}
                onChange={date => setIssueDate(date)}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />
      <Grid container>
        <Grid item xs={12} sm={12} sx={{ p: 2, order: { sm: 1, xs: 2 } }}>
          <Button size='small' onClick={handleAddRow}>
            Add a row
          </Button>
          <Button size='small' onClick={handleDeleteRow}>
            Delete a row
          </Button>
          <div style={{ height: 200, width: '100%' }}>
            <DataGrid rows={rows} getRowId={row => row.mde_id} hideFooter={true} columns={columns} />
          </div>
        </Grid>
      </Grid>
      <Divider />

      <CardContent>
        <Grid container>
          <Grid item xs={12} sm={9} sx={{ order: { sm: 1, xs: 2 } }}></Grid>
          <Grid item xs={12} sm={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
            <CalcWrapper>
              <Typography variant='body2'>Subtotal:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                $1800
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant='body2'>Discount:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                $28
              </Typography>
            </CalcWrapper>
            <Divider
              sx={{ mt: theme => `${theme.spacing(6)} !important`, mb: theme => `${theme.spacing(1.5)} !important` }}
            />
            <CalcWrapper>
              <Typography variant='body2'>Total:</Typography>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                $1690
              </Typography>
            </CalcWrapper>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ my: theme => `${theme.spacing(1)} !important` }} />

      <CardContent sx={{ pt: 4 }}>
        <InputLabel htmlFor='invoice-note'>Note:</InputLabel>
        <TextField
          rows={2}
          fullWidth
          multiline
          id='invoice-note'
          sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
          defaultValue='It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!'
        />
      </CardContent>
    </Card>
  )
}

export default AddCard
