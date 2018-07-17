import Dashboard from '../components/Dashboard'
import DashboardDemo from '../components/DashboardDemo'
import OpenGeo from '../components/Dashboard/Analytics/Document/OpenGeo'
import DashAnalDoc from '../components/Dashboard/Analytics/Document'

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
        },
        {
          path: 'document',
          component: DashAnalDoc,
          children: [
            {
              path: 'opengeo',
              component: OpenGeo
            }
          ]
        }
      ]
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
]
