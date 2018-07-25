import Dashboard from '../components/Dashboard'
import DashboardDemo from '../components/DashboardDemo'
import OpenGeo from '../components/Dashboard/Analytics/Document/OpenGeo'
import OpenGoogle from '../components/Dashboard/Analytics/Document/OpenGoogle'
import OpenBubble from '../components/Dashboard/Analytics/Document/OpenBubble'
import OpenChart from '../components/Dashboard/Analytics/Document/OpenChart'
import OpenBar from '../components/Dashboard/Analytics/Document/OpenBar'
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
        path: 'document/:id',
        component: DashAnalDoc,
        children: [
          {
            path: 'opengeo',
            component: OpenGeo
          },
          {
            path: 'opengoogle',
            component: OpenGoogle
          },
          {
            path: 'openbubble',
            component: OpenBubble
          },
          {
            path: 'openchart',
            component: OpenChart
          },
          {
            path: 'openbar',
            component: OpenBar
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
