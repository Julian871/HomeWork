import request from 'supertest'
import {app} from '../src/settings'
import {videoDb} from '../src/settings'



describe('/videos', () => {

    it('Should get 200 and videoDb', async () => {
        await request(app)
            .get('/videos')
            .expect(200, videoDb)
    })

    it('Should return 404 for existing videos', async () => {
        await request(app)
            .get('/videos/111')
            .expect(404)
    })

    it('Should returns the newly created video', async () => {
        await request(app)
            .post('/videos')
            .send({
                title: "string",
                author: "string",
                availableResolutions: [
                    "P144"
                ]
            })
            .expect(201)
        await request(app)
            .get('/videos')
            .expect(200, videoDb)
    })

    it('Should return 204 after delete all database', async () => {
        await request(app)
            .delete('/videos')
            .expect(204)
    })

    it('Should return 404 if no this video', async () => {
        await request(app)
            .delete('/videos/1')
            .expect(404)
    })

})
