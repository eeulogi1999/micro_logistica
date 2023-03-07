const navigation = () => {
  return [
    {
      title: 'Dashboards',
      icon: 'mdi:home-outline',
      badgeContent: 'new',
      badgeColor: 'error',
      path: '/dashboards/crm'
    },
    {
      title: 'COMPRAS',
      icon: 'mdi:file-document-outline',
      path: '/apps/compras'
    },
    {
      title: 'COMISIONES',
      path: '/apps/comisiones',
      icon: 'uil:chart-pie-alt'
    }
  ]
}

export default navigation
