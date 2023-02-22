// ** Demo Components Imports
import Edit from 'src/views/apps/invoice/edit/Edit'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const InvoiceEdit = () => {
  return (
    <DatePickerWrapper>
      <Edit id='4987' />
    </DatePickerWrapper>
  )
}

export default InvoiceEdit
