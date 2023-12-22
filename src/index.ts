import express from 'express';
import mainRouter from './api/routes/mainRouter';
import { dataSource } from '../dataSources'
import morgan from 'morgan';

dataSource.initialize()
    .then(() => {
        const app = express();
        const port = 3000;
        app.use(express.json());
        app.use(morgan('dev'));

        app.use((req, res, next) => {
            // console.log(`Method: ${req.method}, URL: ${req.url}, IP: ${req.ip} , BODY ${req.body}`);
            next();
        });
        app.use('/api', mainRouter);

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(error => {
        console.error('Error establishing database connection:', error);
    });
