/* eslint-disable no-console */
import { Server } from 'http';
import { AddressInfo } from 'net';
import app from './app';
import 'dotenv/config';

export class ApiServer {
    server!: Server;
    public constructor() {}

    listen = async () => {
        const PORT = process.env.PORT || 3030;
        this.server = app.listen(PORT, async () => {
            console.info(`When it's ${new Date().toLocaleString()} we are getting ready`);
            console.info(`Starting in ${process.env.NODE_ENV} mode`);
            console.info(`Listening on ${PORT}`);
        });
    };

    close = () => {
        this.server.close();
    };

    address = () => {
        return this.server.address() as AddressInfo;
    };
};