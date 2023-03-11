export default async function handler(req, res) {
  const data = await fetch('http://localhost/sistema/' + req.query.url, {
    method: 'POST',
    headers: {
      gcl_id: '1',
      alm_id: '1',
      periodo: '2023-03',
      Authorization: 'Basic YWRtaW5AY29tcGFueWNhY2VsLmNvbTpxd2VydA=='
    },
    body: req.body
  })
    .then(r => r.text())
    .then(r => {
      try {
        return JSON.parse(r)
      } catch (error) {
        return { error: r }
      }
    })
  res.status(200).json(data)
}
