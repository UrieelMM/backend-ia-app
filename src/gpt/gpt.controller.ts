/* eslint-disable prettier/prettier */
import { Response } from 'express';
import { Body, Controller, HttpStatus, Post, Res, Get, Param, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';

@Controller('api/gpt')
export class GptController {
  constructor(private readonly gptService: GptService) { }

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  ProsConsDiscusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
  ) {
    return this.gptService.prosConsDiscusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async ProsConsDiscusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream = await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto);
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || "";
      // console.log(piece);
      res.write(piece);
    }
    res.end();
  }

  @Post('translate')
  translateText(
    @Body() translateDto: TranslateDto,
  ) {
    return this.gptService.translate(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudio: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudio);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string,
  ) {
    const filePath = await this.gptService.textToAudioGetter(fileId);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./generated/audios/uploads",
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split(".").pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          callback(null, fileName);
        }
      })
    })
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe(
        {
          validators: [
            new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 10, message: "File is too large" }),
            new FileTypeValidator({ fileType: "audio/*" })
          ]
        }
      )
    ) file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    return this.gptService.audioToText(file, audioToTextDto);
  }

  @Post("image-generation")
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto,
  ){
    return await this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get("image-generation/:fileName")
  async imageGenerationGetter(
    @Res() res: Response,
    @Param('fileName') fileName: string,
  ){
    const filePath = await this.gptService.imageGenerationGetter(fileName);
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post("image-variation")
  async imageVariation(
    @Body() imageVariationDto: ImageVariationDto,
  ){
    return await this.gptService.imageVariation(imageVariationDto);
  }
}
