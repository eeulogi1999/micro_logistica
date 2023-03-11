export default async function handler(req, res) {
  const data = await fetch('http://localhost/sistema/' + req.query.url, {
    method: 'POST',
    headers: {
      gcl_id: '1',
      alm_id: '1',
      Authorization: 'Basic YWRtaW5AY29tcGFueWNhY2VsLmNvbTpxd2VydA=='
    },
    body: req.body
  })
    .then(r => r.json())
    .then(r => {
      return r
    })
  res.status(200).json(data)
}
