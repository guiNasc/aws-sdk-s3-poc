import dotenv from "dotenv";
import express from "express";
import { S3Helper } from "./s3Helper";

dotenv.config();


const app = express();
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

const port = process.env.SERVER_PORT;

app.get( "/env-api/:key", async ( req, res ) => {
    const result = await S3Helper.find(req.params.key);
    res.send(result);
} );


app.post( "/env-api", async ( req, res ) => {
    await S3Helper.send(req.body);
    res.send(req.body);
} );

app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
