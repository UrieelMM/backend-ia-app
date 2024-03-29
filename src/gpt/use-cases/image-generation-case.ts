/* eslint-disable prettier/prettier */
import OpenAI from "openai";
import * as fs from "fs";
import { downloadBase64ImageAsPng, downloadImagesAsPng } from "src/helpers";

interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationCase = async (openai: OpenAI, { prompt, originalImage, maskImage }: Options) => {

    if (!originalImage || !maskImage) {
        const response = await openai.images.generate({
            prompt: prompt,
            model: "dall-e-3",
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "b64_json",
        });

        // const fileName = await downloadImagesAsPng(response.data[0].url);
        // const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

        return {
            url: response.data[0].b64_json,
            openAIUrl: response.data[0].url,
            revised_prompt: response.data[0].revised_prompt,
        }
    }

    const pngImagePath = await downloadImagesAsPng(originalImage, true);
    const maskPath = await downloadBase64ImageAsPng(maskImage, true);

    const response = await openai.images.edit({
        prompt: prompt,
        model: "dall-e-2",
        image: fs.createReadStream(pngImagePath),
        response_format: "url",
        mask: fs.createReadStream(maskPath),
        n: 1,
        size: "1024x1024",
    });

    // const fileName = await downloadImagesAsPng(response.data[0].url);
    // const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
        url: response.data[0].url,
        openAIUrl: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt,
    }
}