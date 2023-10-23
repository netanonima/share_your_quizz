import {Injectable, UseFilters} from '@nestjs/common';
import sharp from "sharp";
import { promises as fs } from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { Readable } from 'stream';
import {ConfigService} from "@nestjs/config";
import {MediasExceptionsFilter} from "medias/medias-exceptions.filter";

@Injectable()
export class MediasService {
  constructor(
      private config: ConfigService
  ) {}

  @UseFilters(new MediasExceptionsFilter())
  async convertAndResizeImage(base64Image: string): Promise<Buffer> {
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const resizedImageBuffer = await sharp(imageBuffer)
        .resize({
          width: this.config.get('MAX_WIDTH'),
          height: this.config.get('MAX_HEIGHT'),
          fit: sharp.fit.inside,
        })
        .png()
        .toBuffer();
    return resizedImageBuffer;
  }

  @UseFilters(new MediasExceptionsFilter())
  async eraseFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      throw new Error(err);
    }
  }

  @UseFilters(new MediasExceptionsFilter())
  async writeBufferToFile(buffer: Buffer, filePath: string): Promise<void> {
    try {
      await fs.writeFile(filePath, buffer);
    } catch (err) {
      throw new Error(err);
    }
  }

  @UseFilters(new MediasExceptionsFilter())
  async convertAudio(base64Audio: string): Promise<Buffer> {
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    const audioStream = new Readable();
    audioStream.push(audioBuffer);
    audioStream.push(null);  // Signale la fin du stream

    return new Promise((resolve, reject) => {
      ffmpeg.setFfmpegPath(ffmpegStatic);
      const compressionRate = this.config.get('AUDIO_CONVERTED_QUALITY');
      const ffmpegCommand = ffmpeg(audioStream)
          .outputOptions(`-b:a ${compressionRate}k`)
          .format('mp3');

      const chunks = [];
      ffmpegCommand.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      ffmpegCommand.on('error', (error) => {
        reject(error);
      });
      const output = ffmpegCommand.pipe();
      output.on('data', (chunk) => {
        chunks.push(chunk);
      });
    });
  }

  @UseFilters(new MediasExceptionsFilter())
  async convertVideo(base64Video: string): Promise<Buffer> {
    const videoBuffer = Buffer.from(base64Video, 'base64');
    const videoStream = new Readable();
    videoStream.push(videoBuffer);
    videoStream.push(null);  // Signale la fin du stream

    return new Promise((resolve, reject) => {
      ffmpeg.setFfmpegPath(ffmpegStatic);
      const ffmpegCommand = ffmpeg(videoStream)
          .format('mp4')
          .outputOptions('-movflags frag_keyframe+empty_moov');  // Pour créer un fichier MP4 qui peut être lu avant que l'encodage ne soit terminé

      const chunks = [];
      ffmpegCommand.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      ffmpegCommand.on('error', (error) => {
        reject(error);
      });
      const output = ffmpegCommand.pipe();
      output.on('data', (chunk) => {
        chunks.push(chunk);
      });
    });
  }

  @UseFilters(new MediasExceptionsFilter())
  async getVideoDuration(videoBuffer: Buffer): Promise<string> {
    const videoStream = new Readable();
    videoStream.push(videoBuffer);
    videoStream.push(null);

    return new Promise((resolve, reject) => {
      ffmpeg.setFfmpegPath(ffmpegStatic);
      ffmpeg(videoStream)
          .ffprobe((err, data) => {
            if (err) {
              reject(err);
            } else {
              const durationSeconds = data.format.duration;
              const hours = Math.floor(durationSeconds / 3600).toString().padStart(2, '0');
              const minutes = Math.floor((durationSeconds % 3600) / 60).toString().padStart(2, '0');
              const seconds = Math.floor(durationSeconds % 60).toString().padStart(2, '0');
              resolve(`${hours}:${minutes}:${seconds}`);
            }
          });
    });
  }

  async getQuestionMediaBase64File(filePath: string) {

  }

}
