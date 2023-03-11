// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import DialogCustomized from 'src/views/components/dialogs/DialogCustomized'

const OptionsWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const AddActions = props => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Button fullWidth sx={{ mb: 3.5 }} variant='contained' startIcon={<Icon icon='mdi:send-outline' />}>
              COMPARTIR
            </Button>
            <Button fullWidth sx={{ mb: 3.5 }} variant='outlined' onClick={() => props.handleDownloadPdf()}>
              PDF
            </Button>
            <DialogCustomized urlImg={props.urlImg}></DialogCustomized>
            <Button
              fullWidth
              variant='outlined'
              sx={{ mb: 3.5 }}
              onClick={() => {
                let mov = {
                  ...props.mov,
                  mov_mde_id: props.rows,
                  mov_gt4_id: props.mov.mov_gt4_id.value,
                  mov_age_id: props.mov.mov_age_id.value,
                  mov_fechaV: props.mov.mov_fechaE,
                  mov_fechaR: props.mov.mov_fechaE,
                  mov_t12num: 1,
                  mov_alm_id: 1,
                  mov_tipo: 2,
                  mov_gus_id: 1,
                  mov_observaciones: props.mov.mov_obs,
                  mov_igv_id: JSON.stringify({
                    mov_exonerada: 0,
                    mov_inafecta: 0,
                    mov_gravada: 0,
                    mov_igv: 0,
                    mov_neto: 0
                  }),
                  mov_id: '',
                  mov_tce_id: 932,
                  mov_total: props.rows.map(r => r['mde_importe']).reduce((a, b) => a + b),
                  mov_subtotal: props.rows.map(r => r['mde_importe']).reduce((a, b) => a + b)
                }
                fetch('/api/apiCMS/?url=Movimientos/apiSetMov', {
                  method: 'POST',
                  body: JSON.stringify(mov)
                })
                  .then(r => r.json())
                  .then(r => {
                    console.log(r)
                  })
              }}
            >
              GUARDAR
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AddActions
