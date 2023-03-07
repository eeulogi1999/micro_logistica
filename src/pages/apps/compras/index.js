// ** React Imports
import { useState, forwardRef } from 'react'

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
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

import Image from 'next/image'

// **addes eeulopgio19999
import logo_cacel from '/public/images/logos/logo_cacel.png'
import { DataGrid } from '@mui/x-data-grid'
import { Input } from '@mui/material'
import axios from 'axios'

const CustomInput = forwardRef(({ ...props }, ref) => {
  return (
    <TextField
      size='small'
      inputRef={ref}
      {...props}
      sx={{ '& .MuiInputBase-input': { color: 'text.secondary' }, width: '100%' }}
    />
  )
})

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const CustomSelectItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.success.main,
  backgroundColor: 'transparent !important',
  '&:hover': { backgroundColor: `${alpha(theme.palette.success.main, 0.1)} !important` }
}))

const AddCard = props => {
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

  const { clients, selectedClient, bie, age, gt4 } = props

  const [selected, setSelected] = useState('')
  const [moneda, setMoneda] = useState(1)
  const [issueDate, setIssueDate] = useState(new Date())
  const [rows, setRows] = useState([])
  const [mov, setMov] = useState({ mov_subtotal: 0, mov_igv: 0, mov_total: 0 })

  //AADD DATATABLES

  const handleAddRow = () => {
    let id = rows.length > 0 ? Math.max(...rows.map(x => x['mde_id'])) + 1 : 1
    setRows(prevRows => [...prevRows, { mde_id: id, mde_bie_id: 4, mde_q: 1, mde_p: 1, mde_importe: 1 }])
  }

  const handleDeleteRow = id => {
    setRows(prevRows => {
      let rows = prevRows.filter(function (r) {
        return r.mde_id !== id
      })

      return [...rows]
    })
  }

  const columns = [
    { field: 'mde_id', headerName: 'NRO', headerAlign: 'center', editable: true, widht: 80 },
    {
      field: 'mde_bie_id',
      headerName: 'MATERIAL',
      editable: true,
      flex: 1,
      type: 'singleSelect',
      valueOptions: (() => {
        let ops = []
        for (const i in bie) {
          ops.push({ value: parseInt(bie[i].bie_id), label: bie[i].bie_nombre, bie_codigo: bie[i].bie_codigo })
        }

        return ops
      })(),
      valueFormatter: p => {
        const option = p.api.getColumn(p.field).valueOptions.find(({ value }) => value == p.value)

        return option.bie_codigo + ' - ' + option.label
      }
    },
    {
      field: 'mde_q',
      headerName: 'CANTIDAD',
      headerAlign: 'center',
      align: 'right',
      editable: true,
      flex: 1,
      valueFormatter: p => Math.ceil10(p.value, -2).toFixed(2)
    },
    {
      field: 'mde_p',
      headerName: 'PRECIO',
      headerAlign: 'center',
      align: 'right',
      editable: true,
      flex: 1,
      valueFormatter: p => Math.ceil10(p.value, -2).toFixed(2)
    },
    {
      field: 'mde_importe',
      headerName: 'IMPORTE',
      headerAlign: 'center',
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
            <Select
              fullWidth
              size='small'
              value={selected}
              onChange={e => {
                setSelected(e.target.value)
              }}
              sx={{ mb: 4 }}
            >
              <CustomSelectItem value=''>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', '& svg': { mr: 2 } }}>
                  <Icon icon='mdi:plus' fontSize={20} />
                  Nuevo
                </Box>
              </CustomSelectItem>
              {age !== undefined &&
                age.map(a => (
                  <MenuItem key={a.age_id} value={parseInt(a.age_id)}>
                    {a.age_gpe_id
                      ? a.age_gpe_id.gpe_identificacion +
                        ' - ' +
                        a.age_gpe_id.gpe_nombre +
                        ', ' +
                        a.age_gpe_id.gpe_apellidos
                      : a.age_gem_id.gem_ruc + ' - ' + a.age_gem_id.gem_razonsocial}
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
                  CONTACTO{selectedClient.contact}
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
              <Select fullWidth size='small' value={moneda} sx={{ mb: 4 }} onChange={e => setMoneda(e.target.value)}>
                <CustomSelectItem value=''></CustomSelectItem>
                {gt4 !== undefined &&
                  gt4.map(g => (
                    <MenuItem key={g.gt4_id} value={parseInt(g.gt4_id)}>
                      {g.gt4_descripcion}
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
      <Divider />
      <CardContent>
        <Grid container>
          <Grid item xs={12} sm={9} sx={{ order: { sm: 1, xs: 2 } }}></Grid>
          <Grid item xs={12} sm={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
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
                    : 0
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
              sx={{ mt: theme => `${theme.spacing(6)} !important`, mb: theme => `${theme.spacing(1.5)} !important` }}
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
                    : 0
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
  )
}

export default AddCard

export const getServerSideProps = async () => {
  const bie = await axios
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

  const age = await axios
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

  const gt4 = await axios
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

  return { props: { bie, age, gt4 } }
}
