import { TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker renderInput={params => <TextField {...params} />} />
    </LocalizationProvider>
  )
}
