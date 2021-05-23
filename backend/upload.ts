import axios from 'axios'

import { PlexServer } from './modules/plexapi'

// void PlexServer.build('https://plex.brasher.ca', 'kPhapV7PXF2Hdv-C9Dyd').then((server) => {
//   void server.getLibrary().then(() => {
//     console.log('complete')
//   })
// })

// axios
//   .get('https://plex.brasher.ca/library/sections/2/all?X-Plex-Token=kPhapV7PXF2Hdv-C9Dyd')
//   .then((res) => {
//     console.log(res.data)
//     console.log(res.headers['content-type'])
//   })

axios.get('https://plex.brasher.ca/?X-Plex-Token=kPhapV7PXF2Hdv-C9Dyd').then((res) => {
  console.log(res.data)
  console.log(res.request)
})
