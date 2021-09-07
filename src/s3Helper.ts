import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";


export class S3Helper {

    private static _params = {
        Bucket: "new-aws-sample-ask",
        Key: "m.env.sample",
        Body: "",
    }

    private static _s3Client = new S3Client({ region: "us-east-1" });

    public static async send(requestBody: any) {

        this._params.Body = JSON.stringify(requestBody.content);
        this._params.Key = requestBody.fileName;

        console.log("[s3.send - _params]", this._params);
        const result = await this._s3Client.send(new PutObjectCommand(this._params)).catch(err => {
            console.log(err)
        });

        return result;
    }

    public static async find(key: string): Promise<any> {
        this._params.Key = key;
        console.log("[s3.find - _params]", this._params);


        const result = await this._s3Client.send(new GetObjectCommand(this._params))
            .then(async resp => {
                const parsed = await this.streamToString(resp.Body as Readable);
                console.log(`[resp.Body - parsed]`, parsed);
                return parsed;
            })
            .catch(err => {
                console.log(err)
            })


        return result;
    }

    private static streamToString(stream: Readable): Promise<string> {
        return new Promise((resolve, reject) => {
            const chunks: any[] | Uint8Array[] = [];
            stream.on("data", (chunk) => chunks.push(chunk));
            stream.on("error", reject);
            stream.on("end", () => resolve(
                Buffer
                    .concat(chunks)
                    .toString("utf8")
            )
            );
        });


    }

}

