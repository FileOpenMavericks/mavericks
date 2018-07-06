import Dashboard from '../components/Dashboard'
import DashboardDemo from '../components/DashboardDemo'

import NotFound from '../components/NotFound'

export default [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
            path: 'demo',
            component: DashboardDemo
        }
      ]
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
]
