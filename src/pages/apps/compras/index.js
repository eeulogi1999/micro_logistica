// ** React Imports
import { useRef, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import { styled, alpha, useTheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import CardContent from '@mui/material/CardContent'

import Image from 'next/image'

// **addes eeulopgio19999
import logo_cacel from '/public/images/logos/logo_cacel.png'
import { DataGrid } from '@mui/x-data-grid'
import { Input } from '@mui/material'
import axios from 'axios'
import Select from 'react-select'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import AddActions from 'src/views/apps/invoice/add/AddActions'
import { Document, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer'
import html2canvas from 'html2canvas'
import CreatePdf from '/src/pages/apps/compras/pdf'
import DialogCustomized from 'src/views/components/dialogs/DialogCustomized'

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const zfill = function (number, width) {
  var numberOutput = Math.abs(number) /* Valor absoluto del número */
  var length = number.toString().length /* Largo del número */
  var zero = '0' /* String de cero */

  if (width <= length) {
    if (number < 0) {
      return '-' + numberOutput.toString()
    } else {
      return numberOutput.toString()
    }
  } else {
    if (number < 0) {
      return '-' + zero.repeat(width - length) + numberOutput.toString()
    } else {
      return zero.repeat(width - length) + numberOutput.toString()
    }
  }
}

const AppCompras = props => {
  ;(function () {
    /**
     * Ajuste decimal de un número.
     *
     * @param {String}  type  El tipo de ajuste.
     * @param {Number}  value El número.
     * @param {Integer} exp   El exponente (El logaritmo de ajuste en base 10).
     * @returns {Number} El valor ajustado.
     */
    function decimalAdjust(type, value, exp) {
      // Si exp es undefined o cero...
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value)
      }
      value = +value
      exp = +exp

      // Si el valor no es un número o exp no es un entero...
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN
      }

      // Shift
      value = value.toString().split('e')
      value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)))

      // Shift back
      value = value.toString().split('e')

      return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp))
    }

    // Decimal round
    if (!Math.round10) {
      Math.round10 = function (value, exp) {
        return decimalAdjust('round', value, exp)
      }
    }

    // Decimal floor
    if (!Math.floor10) {
      Math.floor10 = function (value, exp) {
        return decimalAdjust('floor', value, exp)
      }
    }

    // Decimal ceil
    if (!Math.ceil10) {
      Math.ceil10 = function (value, exp) {
        return decimalAdjust('ceil', value, exp)
      }
    }
  })()

  const { selectedClient, bd_bie, bd_age, bd_gt4 } = props

  const [bie, setBie] = useState(() => {
    let ops = []
    for (const i in bd_bie) {
      ops.push({ value: parseInt(bd_bie[i].bie_id), label: bd_bie[i].bie_nombre, bie_codigo: bd_bie[i].bie_codigo })
    }

    return ops
  })

  const [age, setAge] = useState(() => {
    let opt = []
    for (const i in bd_age) {
      let a = bd_age[i]
      opt.push({
        value: parseInt(a.age_id),
        label: a.age_gpe_id
          ? a.age_gpe_id.gpe_identificacion + ' - ' + a.age_gpe_id.gpe_nombre + ', ' + a.age_gpe_id.gpe_apellidos
          : a.age_gem_id.gem_ruc + ' - ' + a.age_gem_id.gem_razonsocial
      })
    }

    return opt
  })

  const [gt4, setGt4] = useState(() => {
    let opt = []
    for (const i in bd_gt4) {
      let g = bd_gt4[i]
      opt.push({
        value: parseInt(g.gt4_id),
        label: g.gt4_descripcion
      })
    }

    return opt
  })
  const [rows, setRows] = useState([])

  const [mov, setMov] = useState({
    mov_igv: 0,
    mov_fechaE: new Date().toLocaleString('af-ZA').split(' ')[0],
    mov_num: 1,
    mov_age_id: 0,
    mov_gt4_id: (() => gt4.filter(r => r.value === 1))()
  })
  const printRef = useRef()
  const [urlImg, setUrlImg] = useState('')

  const theme = useTheme()

  console.log(rows)
  console.log(mov)
  console.log(urlImg)

  //AADD DATATABLES

  const handleAddRow = () => {
    let id = rows.length > 0 ? Math.max(...rows.map(x => x['mde_id'])) + 1 : 1
    setRows(prevRows => [...prevRows, { mde_id: id, mde_bie_id: 4, mde_q: 1, mde_p: 1, mde_importe: 1 }])
  }

  const handleDownloadPdf = async () => {
    const element = printRef.current
    const canvas = await html2canvas(element)
    const data = canvas.toDataURL('image/png')
    setUrlImg(data)
  }

  const handleDeleteRow = id => {
    setRows(prevRows => {
      let rows = prevRows.filter(function (r) {
        return r.mde_id !== id
      })

      return [...rows]
    })
  }

  const colourStyles = {
    option: styles => ({ ...styles, zIndex: '18000', position: 'relative' })
  }

  const columns = [
    { field: 'mde_id', headerName: 'NRO', headerAlign: 'center', editable: true, widht: 80 },
    {
      field: 'mde_bie_id',
      headerName: 'MATERIAL',
      editable: true,
      flex: 1,
      type: 'singleSelect',
      valueOptions: bie,
      valueFormatter: p => {
        const option = p.api.getColumn(p.field).valueOptions.find(({ value }) => value == p.value)

        return option.bie_codigo + ' - ' + option.label
      }
    },

    // {
    //   field: 'mde_bie_id',
    //   headerName: 'MATERIAL',
    //   editable: true,
    //   flex: 1,
    //   renderEditCell: p => (
    //     <Select
    //       sx={{ zIndex: '100' }}
    //       isClearable={true}
    //       options={(() => {
    //         let ops = []
    //         for (const i in bie) {
    //           ops.push({ value: parseInt(bie[i].bie_id), label: bie[i].bie_nombre, bie_codigo: bie[i].bie_codigo })
    //         }
    //         console.log(ops)

    //         return ops
    //       })()}
    //       styles={colourStyles}
    //     />
    //   )
    // },
    {
      field: 'mde_q',
      headerName: 'CANTIDAD',
      headerAlign: 'center',
      type: 'number',
      align: 'right',
      editable: true,
      flex: 1,
      valueFormatter: p => Math.ceil10(p.value, -2).toFixed(2)
    },
    {
      field: 'mde_p',
      headerName: 'PRECIO',
      headerAlign: 'center',
      type: 'number',
      align: 'right',
      editable: true,
      flex: 1,
      valueFormatter: p => Math.ceil10(p.value, -2).toFixed(2)
    },
    {
      field: 'mde_importe',
      headerName: 'IMPORTE',
      headerAlign: 'center',
      type: 'number',
      flex: 1,
      align: 'right',
      editable: true,
      valueFormatter: p => Math.ceil10(p.value, -2).toFixed(2)
    },
    {
      field: 'mde_opt',
      width: 100,
      hideable: false,
      hideSortIcons: true,
      renderHeader: () => (
        <Button size='small' onClick={handleAddRow}>
          add
        </Button>
      ),
      renderCell: p => {
        return (
          <Button
            size='small'
            onClick={() => {
              handleDeleteRow(p.id)
            }}
          >
            del
          </Button>
        )
      }
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xl={9} md={8} xs={12} sx={{ zIndex: 1000 }}>
        <Card ref={printRef}>
          <CardContent>
            <Grid container>
              <Grid item xl={4} xs={4} sx={{ mb: { xl: 0, xs: 4 } }}>
                <Image src={logo_cacel} alt='logo cacel' width={'200'} priority />
              </Grid>
              <Grid item xl={4} xs={4}>
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
              <Grid item xl={4} xs={4}>
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
                  <Typography
                    variant='string'
                    sx={{ mb: 1, color: 'red', fontSize: 23, fontWeight: 700, lineHeight: 1.2 }}
                  >
                    NE01-
                    <Input
                      id='mov_igv'
                      sx={{
                        width: 150
                      }}
                      type='number'
                      inputProps={{
                        'aria-label': 'description',
                        style: { color: 'red', fontSize: 23, fontWeight: 700, lineHeight: 1.2 }
                      }}
                      value={zfill(mov.mov_num, 8)}
                      onChange={e => {
                        setMov({ ...mov, mov_num: e.target.value })
                      }}
                    />
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ my: theme => `${theme.spacing(1)} !important` }} />
          <CardContent sx={{ pb: 2 }}>
            <Grid container>
              <Grid item xs={4} sm={4} sx={{ mb: { lg: 0, xs: 4 } }}>
                <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary' }}>
                  Agente:
                </Typography>
                <Select
                  isClearable={true}
                  name='mov_age_id'
                  options={age}
                  onChange={e => {
                    setMov({ ...mov, mov_age_id: e })
                  }}
                  value={mov.mov_age_id}
                  styles={{
                    control: (base, state) => {
                      return {
                        ...base,
                        color: 'inherit',
                        borderColor: state.isFocused ? theme.palette.primary.main : base.borderColor,
                        borderWidth: state.isFocused ? '2px' : '1px',
                        backgroundColor: 'transparent !important',
                        isFocused: theme.palette.primary.main,
                        ':hover': { borderColor: theme.palette.primary.main },
                        color: 'inherit',
                        boxShadow: ''
                      }
                    },
                    menu: (base, state) => ({
                      ...base,
                      zIndex: '5',
                      backgroundColor: theme.palette.background.paper
                    }),
                    option: (base, { data, isDisabled, isFocused, isSelected }) => {
                      return {
                        ...base,
                        cursor: isDisabled ? 'not-allowed' : 'default',
                        backgroundColor: isSelected ? theme.palette.primary.main : 'inherit',
                        ':active': { backgroundColor: isSelected ? theme.palette.primary.main : 'inherit' },
                        ':hover': { backgroundColor: `${alpha(theme.palette.primary.main, 0.1)} !important` }
                      }
                    },
                    singleValue: base => ({ ...base, color: 'inherit' }),
                    input: (base, state) => {
                      return {
                        ...base,
                        color: 'inherit',
                        borderColor: state.isFocused ? theme.palette.primary.main : base.borderColor,
                        backgroundColor: 'transparent !important',
                        isFocused: theme.palette.primary.main,
                        ':hover': { borderColor: theme.palette.primary.main },
                        boxShadow: ''
                      }
                    },
                    valueContainer: (provided, state) => ({
                      ...provided,
                      height: '50px',
                      padding: '0 6px'
                    })
                  }}
                />
                {selectedClient !== null && selectedClient !== undefined ? (
                  <div>
                    <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                      {selectedClient.company}
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                      DIRECCION: {selectedClient.address}
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                      CONTACTO{selectedClient.contact}
                    </Typography>
                    <Typography variant='body2' sx={{ mb: 1, color: 'text.primary' }}>
                      CORREO:{selectedClient.companyEmail}
                    </Typography>
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={4} sm={4} sx={{ mb: { lg: 0, xs: 4 } }}></Grid>
              <Grid
                item
                xs={4}
                sm={4}
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: ['flex-start', 'flex-end'] }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant='subtitle2'>Moneda</Typography>
                  <Select
                    isClearable={true}
                    value={mov.mov_gt4_id}
                    name='mov_gt4_id'
                    options={gt4}
                    onChange={e => {
                      setMov({ ...mov, mov_gt4_id: e })
                    }}
                    styles={{
                      control: (base, state) => {
                        return {
                          ...base,
                          color: 'inherit',
                          borderColor: state.isFocused ? theme.palette.primary.main : base.borderColor,
                          borderWidth: state.isFocused ? '2px' : '1px',
                          backgroundColor: 'transparent !important',
                          isFocused: theme.palette.primary.main,
                          ':hover': { borderColor: theme.palette.primary.main },
                          color: 'inherit',
                          boxShadow: ''
                        }
                      },
                      menu: (base, state) => ({
                        ...base,
                        zIndex: '5',
                        backgroundColor: theme.palette.background.paper
                      }),
                      option: (base, { data, isDisabled, isFocused, isSelected }) => {
                        return {
                          ...base,
                          cursor: isDisabled ? 'not-allowed' : 'default',
                          backgroundColor: isSelected ? theme.palette.primary.main : 'inherit',
                          ':active': { backgroundColor: isSelected ? theme.palette.primary.main : 'inherit' },
                          ':hover': { backgroundColor: `${alpha(theme.palette.primary.main, 0.1)} !important` }
                        }
                      },
                      singleValue: base => ({ ...base, color: 'inherit' }),
                      input: (base, state) => {
                        return {
                          ...base,
                          color: 'inherit',
                          borderColor: state.isFocused ? theme.palette.primary.main : base.borderColor,
                          backgroundColor: 'transparent !important',
                          isFocused: theme.palette.primary.main,
                          ':hover': { borderColor: theme.palette.primary.main },
                          boxShadow: ''
                        }
                      },
                      valueContainer: (provided, state) => ({
                        ...provided,
                        height: '50px',
                        padding: '0 6px'
                      })
                    }}
                  />
                </Box>
                <Box sx={{ mb: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ width: '100%' }}
                      format='DD/MM/YYYY'
                      value={dayjs(mov.mov_fechaE)}
                      name='mov_fechaE'
                      onChange={e => setMov({ ...mov, mov_fechaE: e.$d.toLocaleString('af-ZA').split(' ')[0] })}
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardContent>
            <Grid container>
              <Grid item xs={12} sm={12} xl={12}>
                <DataGrid
                  autoHeight
                  rows={rows}
                  getRowId={row => row.mde_id}
                  hideFooter={true}
                  columns={columns}
                  onCellEditCommit={(p, e) => {
                    setRows(prevRows => {
                      let updaterow = {}

                      let rows = prevRows.filter(function (r) {
                        if (r.mde_id == p.id) {
                          updaterow = r
                        }

                        return r.mde_id !== p.id
                      })
                      if (p.field == 'mde_q') {
                        updaterow.mde_importe = updaterow.mde_p * p.value
                      }
                      if (p.field == 'mde_p') {
                        updaterow.mde_importe = updaterow.mde_q * p.value
                      }
                      if (p.field == 'mde_importe') {
                        updaterow.mde_p = p.value / updaterow.mde_q
                      }
                      updaterow[p.field] = parseFloat(p.value)

                      return [...rows, updaterow]
                    })
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardContent>
            <Grid container>
              <Grid item xs={12} sm={9}></Grid>
              <Grid item xs={12} sm={3} sx={{ mb: { sm: 0, xs: 4 } }}>
                <CalcWrapper>
                  <InputLabel htmlFor='mov_subtotal'>SUBTOTAL:</InputLabel>
                  <Input
                    id='mov_subtotal'
                    placeholder='0.00'
                    startAdornment={<InputAdornment position='start'>S/</InputAdornment>}
                    sx={{ width: 150, align: 'right' }}
                    inputProps={{ 'aria-label': 'description', style: { textAlign: 'right' } }}
                    value={
                      rows.length > 0
                        ? Math.ceil10(
                            rows.map(r => r['mde_importe']).reduce((a, b) => a + b),
                            -2
                          ).toFixed(2)
                        : '0.00'
                    }
                  />
                </CalcWrapper>
                <CalcWrapper>
                  <InputLabel htmlFor='mov_igv'>IGV (18%):</InputLabel>
                  <Input
                    id='mov_igv'
                    placeholder='0.00'
                    sx={{ width: 150, align: 'right' }}
                    startAdornment={<InputAdornment position='start'>S/</InputAdornment>}
                    inputProps={{ 'aria-label': 'description', style: { textAlign: 'right' } }}
                    value={mov.mov_igv.toFixed(2)}
                  />
                </CalcWrapper>
                <Divider
                  sx={{
                    mt: theme => `${theme.spacing(6)} !important`,
                    mb: theme => `${theme.spacing(1.5)} !important`
                  }}
                />
                <CalcWrapper>
                  <InputLabel htmlFor='mov_total'>TOTAL:</InputLabel>
                  <Input
                    id='mov_total'
                    placeholder='0.00'
                    startAdornment={<InputAdornment position='start'>S/</InputAdornment>}
                    sx={{ width: 150, textAlign: 'right' }}
                    inputProps={{ 'aria-label': 'description', style: { textAlign: 'right' } }}
                    value={
                      rows.length > 0
                        ? Math.ceil10(
                            rows.map(r => r['mde_importe']).reduce((a, b) => a + b),
                            -2
                          ).toFixed(2)
                        : '0.00'
                    }
                  />
                </CalcWrapper>
              </Grid>
            </Grid>
          </CardContent>

          <Divider sx={{ my: theme => `${theme.spacing(1)} !important` }} />

          <CardContent sx={{ pt: 4 }}>
            <InputLabel htmlFor='invoice-note'>NOTAS:</InputLabel>
            <TextField
              rows={2}
              fullWidth
              multiline
              id='invoice-note'
              sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
              placeholder='Obserbaciones'
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xl={3} md={4} xs={4} sx={{ zIndex: 1, displayPrint: 'none' }}>
        <AddActions urlImg={urlImg} handleDownloadPdf={handleDownloadPdf} />
      </Grid>
    </Grid>
  )
}

export default AppCompras

export const getServerSideProps = async () => {
  const bd_bie = await axios
    .get('https://sistema.companycacel.com/Main/getAll/bie', {
      headers: {
        gcl_id: '1',
        alm_id: '1',
        periodo: '2023-03',
        Authorization: 'Basic YWRtaW5AY29tcGFueWNhY2VsLmNvbTpxd2VydA=='
      }
    })
    .then(r => {
      return r.data
    })

  const bd_age = await axios
    .get('https://sistema.companycacel.com/Main/getAll/age', {
      headers: {
        gcl_id: '1',
        alm_id: '1',
        periodo: '2023-03',
        Authorization: 'Basic YWRtaW5AY29tcGFueWNhY2VsLmNvbTpxd2VydA=='
      }
    })
    .then(r => {
      return r.data
    })

  const bd_gt4 = await axios
    .get('https://sistema.companycacel.com/Main/getAll/gt4', {
      headers: {
        gcl_id: '1',
        alm_id: '1',
        periodo: '2023-03',
        Authorization: 'Basic YWRtaW5AY29tcGFueWNhY2VsLmNvbTpxd2VydA=='
      }
    })
    .then(r => {
      return r.data
    })

  return { props: { bd_bie, bd_age, bd_gt4 } }
}
