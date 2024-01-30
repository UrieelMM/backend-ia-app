/* eslint-disable prettier/prettier */
import * as path from "path";
import * as fs from "fs";
import OpenAI from "openai";

interface Options {
    prompt: string;
    voice?: string;
}


export const textToAudioCase = async (openAi: OpenAI, {prompt, voice}: Options) => {
    const voices ={
        "nova": "nova",
        "alloy": "alloy",
        "echo": "echo",
        "fable": "fable",
        "onyx": "onyx",
        "shimmer": "shimmer",
    }

    const selectedVoice = voices[voice] || "alloy";

    const folderPath = path.resolve(__dirname, "../../../generated/audios/");
    const speechFile = path.resolve(`${folderPath}/${selectedVoice}-${new Date().getTime()}.mp3`);

    fs.mkdirSync(folderPath, {recursive: true});

    const mp3 = await openAi.audio.speech.create({
        model: "tts-1-hd",
        voice: selectedVoice,
        input: prompt,
        response_format: "mp3",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(speechFile, buffer);

    return speechFile;
}