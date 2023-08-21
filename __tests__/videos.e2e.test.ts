import request from 'supertest'
import {app, videoDb} from '../src/settings'



describe('/videos', () => {

    it('Should get status 200 and videoDb', async () => {
        await request(app)
            .get('/videos')
            .expect(200, videoDb)
    })

    it('Should get by ID status 200 and videoDb', async() => {
        await request(app)
            .get('/videos/0')
            .expect(200, {
                id: 0,
                title: 'string',
                author: 'string',
                canBeDownloaded: true,
                minAgeRestriction: null,
                createdAt: '2023-08-17T18:06:43.264Z',
                publicationDate: '2023-08-17T18:06:43.264Z',
                availableResolutions: [ 'P144' ]
            })
    })

})
