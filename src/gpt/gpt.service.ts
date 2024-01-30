/* eslint-disable prettier/prettier */
import * as path from "path";
import * as fs from "fs";
import { Injectable } from '@nestjs/common';
import { orthographyCheck, prosConsDiscusserStreamUseCase, prosConsDiscusserUseCase, translateCase, textToAudioCase, audioToTextCase, imageGenerationCase, imageVariationCase } from "./use-cases"
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import OpenAI from 'openai';

@Injectable()
export class GptService {
    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    async orthographyCheck(orthographyDto: OrthographyDto) {
        return await orthographyCheck(this.openai, {
            prompt: orthographyDto.prompt,
        });
    }
    async prosConsDiscusser({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDiscusserUseCase(this.openai, { prompt });
    }
    async prosConsDiscusserStream({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDiscusserStreamUseCase(this.openai, { prompt });
    }
    async translate(translateDto: TranslateDto) {
        return await translateCase(this.openai, {
            prompt: translateDto.prompt,
            lang: translateDto.lang,
        });
    }
    async textToAudio(textToAudio: TextToAudioDto) {
        return await textToAudioCase(this.openai, {
            prompt: textToAudio.prompt,
            voice: textToAudio.voice,
        });
    }

    async textToAudioGetter(fileId: string) {
        const filePath = path.resolve(__dirname, "../../generated/audios/", `${fileId}.mp3`);

        const wasFound = fs.existsSync(filePath);
        if (!wasFound) {
            return "File not found";
        }
        return filePath;
    }

    async audioToText(audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto) {
        const { prompt } = audioToTextDto;
        return await audioToTextCase(this.openai, {
            prompt: prompt,
            audioFile: audioFile,
        });
    }

    async imageGeneration(imageGenerationDto: ImageGenerationDto) {
        return await imageGenerationCase(this.openai, {
            prompt: imageGenerationDto.prompt,
            originalImage: imageGenerationDto.originalImage,
            maskImage: imageGenerationDto.maskImage,
        });
    }

    async imageGenerationGetter(fileName: string) {
        const filePath = path.resolve("./", "./generated/images/",fileName);

        const wasFound = fs.existsSync(filePath);
        if (!wasFound) {
            return "File not found";
        }
        return filePath;
    }

    async imageVariation(imageGenerationDto: ImageVariationDto) {
        return await imageVariationCase(this.openai, {
            baseImage: imageGenerationDto.baseImage,
        });
    }
}
