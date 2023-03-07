import axios from 'axios'

export default async function handler(req, res) {
  const data = await axios
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
  res.status(200).json(data)
}
