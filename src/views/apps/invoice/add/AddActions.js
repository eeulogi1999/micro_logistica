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
            <Button fullWidth variant='outlined' sx={{ mb: 3.5 }}>
              GUARDAR
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AddActions
