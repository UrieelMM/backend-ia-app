/* eslint-disable prettier/prettier */
import * as path from "path";
import * as fs from "fs";
import axios from "axios";
import * as sharp from "sharp";


export const downloadImagesAsPng = async (url: string, fullPath: boolean = false) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const folderPath = path.resolve("./", "./generated/images/");
    fs.mkdirSync(folderPath, { recursive: true });

    const imageNamePng = `${new Date().getTime()}.png`;
    const buffer = Buffer.from(await response.data);

    // fs.writeFileSync(`${folderPath}/${imageNamePng}`, buffer);

    await sharp(buffer)
        .png()
        .ensureAlpha()
        .toFile(path.join(folderPath, imageNamePng));

    return fullPath ? path.join(folderPath, imageNamePng) : imageNamePng;
}

export const downloadBase64ImageAsPng = async (base64Image: string, fullPath: boolean = false) => {

    // Remover encabezado
    base64Image = base64Image.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const folderPath = path.resolve('./', './generated/images/');
    fs.mkdirSync(folderPath, { recursive: true });

    const imageNamePng = `${new Date().getTime()}-64.png`;


    // Transformar a RGBA, png // Así lo espera OpenAI
    await sharp(imageBuffer)
        .png()
        .ensureAlpha()
        .toFile(path.join(folderPath, imageNamePng));

    return fullPath ? path.join(folderPath, imageNamePng) : imageNamePng;
}