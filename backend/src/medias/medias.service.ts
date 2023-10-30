import {ForbiddenException, Injectable, NotFoundException, UseFilters} from '@nestjs/common';
import * as sharp from 'sharp';
import { promises as fs } from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { Readable } from 'stream';
import {ConfigService} from "@nestjs/config";
import {MediasExceptionsFilter} from "medias/medias-exceptions.filter";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Media} from "medias/entities/media.entity";
import { dirname, join } from 'path';

@Injectable()
export class MediasService {
  constructor(
      private config: ConfigService,
      @InjectRepository(Media)
      private readonly mediaRepository: Repository<Media>
  ) {}

  @UseFilters(new MediasExceptionsFilter())
  async convertAndResizeImage(base64Image: string): Promise<Buffer> {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    try {
      const resizedImageBuffer = await sharp(imageBuffer)
          .resize({
            width: this.config.get('MAX_WIDTH'),
            height: this.config.get('MAX_HEIGHT'),
            fit: sharp.fit.inside,
            withoutEnlargement: true
          })
          .toBuffer();
      return resizedImageBuffer;
    } catch (error) {
      throw new Error(`An error occurred: ${error.message}`);
    }
  }

  @UseFilters(new MediasExceptionsFilter())
  async eraseFile(filePath: string, filename: string, extension: string): Promise<void> {
    try {
      const fullPath = `${filePath}${filename}.${extension}`;
      await fs.unlink(fullPath);
      let currentDir = dirname(fullPath);

      while (currentDir && currentDir !== this.config.get('MEDIA_PATH')) {
        const files = await fs.readdir(currentDir);

        if (files.length === 0) {
          await fs.rmdir(currentDir);
          currentDir = dirname(currentDir);
        } else {
          break;
        }
      }
    } catch (err) {
      console.error('Error during file/folder deletion', err);
      throw new Error('Error during file/folder deletion');
    }
  }

  @UseFilters(new MediasExceptionsFilter())
  async writeBufferToFile(buffer: Buffer, filePath: string, filenameAndExtension: string): Promise<void> {
    const fullPath = filePath + filenameAndExtension;
    console.log('writeBufferToFile');
    try {
      await fs.mkdir(filePath, { recursive: true });
      await fs.writeFile(fullPath, buffer);
    } catch (err) {
      throw new Error(err);
    }
  }

  @UseFilters(new MediasExceptionsFilter())
  async convertFile(currentAudioFilePath, newAudioFilePath): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg.setFfmpegPath(this.config.get('FFMPEG_PATH'));
      ffmpeg(currentAudioFilePath)
          .output(newAudioFilePath)
          .on('end', () => {
            require('fs').unlink(currentAudioFilePath, (err) => {
              if (err) reject(err);
              else resolve();
            });
          })
          .on('error', (err) => {
            reject(err);
          })
          .run();
    });
  }

  formatDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((durationInSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(durationInSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  @UseFilters(new MediasExceptionsFilter())
  async saveFile(base64Video: string, outputPath: string): Promise<string> {
    const videoData = base64Video.split(',')[1];

    const buffer = Buffer.from(videoData, 'base64');

    const dir = dirname(outputPath);

    try {
      await fs.access(dir).catch(() => fs.mkdir(dir, { recursive: true }));

      await fs.writeFile(outputPath, buffer);

      const duration = await new Promise<number>((resolve, reject) => {
        ffmpeg.ffprobe(outputPath, (err, metadata) => {
          if (err) {
            reject(err);
          } else {
            resolve(metadata.format.duration);
          }
        });
      });

      return this.formatDuration(duration);
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }



  @UseFilters(new MediasExceptionsFilter())
  async getVideoDuration(videoBuffer: Buffer): Promise<string> {
    const videoStream = new Readable();
    videoStream.push(videoBuffer);
    videoStream.push(null);

    return new Promise((resolve, reject) => {
      ffmpeg.setFfmpegPath(this.config.get('FFMPEG_PATH'));
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

  async getQuestionMediaBase64File(filePath: string): Promise<string> {
    try {
      const fileBuffer = await fs.readFile(filePath);
      return fileBuffer.toString('base64');
    } catch (err) {
      throw new Error(`Impossible de lire le fichier : ${err}`);
    }
  }

}
