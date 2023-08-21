import request from 'supertest'
import {app} from '../src/settings'
import {videoDb} from '../src/settings'



describe('/videos', () => {

    it('Should get 200 and videoDb', async () => {
        await request(app)
            .get('/videos')
            .expect(200, videoDb)
    })

})
