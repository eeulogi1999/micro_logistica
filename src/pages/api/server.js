import axios from 'axios'

export default async function handler(req, res) {
  const data = await axios
    .get(
      'https://sistema.companycacel.com/Gerencial/getListComisiones' + '/?fi=' + req.query.fi + '&ff=' + req.query.ff,
      {
        headers: {
          gcl_id: '1',
          alm_id: '1',
          periodo: '2023-01',
          Authorization: 'Basic YWRtaW5AY29tcGFueWNhY2VsLmNvbTpxd2VydA=='
        }
      }
    )
    .then(r => {
      return r.data
    })
  res.status(200).json(data)
}
