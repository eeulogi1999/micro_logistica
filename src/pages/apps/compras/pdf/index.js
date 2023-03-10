import React, { Component } from 'react'
import { Document, Image, Page, PDFViewer } from '@react-pdf/renderer'

class CreatePdf extends Component {
  render() {
    console.log(this.props)

    return (
      <PDFViewer style={{ width: '100%', height: 900 }} showToolbar={true}>
        <Document>
          <Page size='A4'>
            <Image src={this.props.urlImg} alt='doc' />
          </Page>
        </Document>
      </PDFViewer>
    )
  }
}

export default CreatePdf
