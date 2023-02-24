import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { j } from '../../common/log.utils';
import * as fs from 'fs';
import { FileUploadResponseDto } from './dto/upload.dto';
import { IFileRetrieval } from './interfaces/file.retrieval';
import { config } from './config/config';
import Jimp from 'jimp';
import { keyValue } from 'ferramenta';
import * as path from 'path';
import { MetadataInterface } from './interfaces/metadata.interface';

export const MAX_THUMB_SIZE = 256;
export const MIN_THUMB_SIZE = 16;

@Injectable()
export class FilesService extends BaseService {
	/**
	 * Uploads file to the server
	 * @param file
	 * @param userId
	 */
	async uploadFile(file: Express.Multer.File, userId: string): Promise<FileUploadResponseDto> {
		const timestamp = new Date().getTime();
		const metadata: MetadataInterface = { ...file, userid: userId, timestamp };

		if (!file) {
			this.logger.error('uploadFile error=EmptyFile ' + keyValue(metadata));
			throw new BadRequestException('Empty "file" field in multipart-form request');
		}

		fs.writeFileSync(file.path + '.json', j(metadata));
		this.logger.log('uploadFile ' + keyValue(metadata));
		return new FileUploadResponseDto(file.filename, file.size);
	}

	/**
	 * Retrieves file from the server
	 * @param fileId
	 * @param thumbSize
	 */
	async retrieveFile(fileId: string, thumbSize: number): Promise<IFileRetrieval> {
		let filepath = path.join(config().files.uploadDir, fileId);
		const jsonFilename = filepath + '.json';

		if (!fs.existsSync(jsonFilename)) {
			this.logger.error('retrieveFile error=NotFound ' + keyValue({ fileId, jsonFilename, thumbSize }));
			throw new NotFoundException('');
		}

		this.logger.log('Retrieve ' + keyValue({ fileId, thumbSize }));

		const metadata: MetadataInterface = JSON.parse(fs.readFileSync(jsonFilename).toString());
		const type = metadata.mimetype;
		const size = metadata.size;
		let filename = metadata.originalname;

		if (thumbSize > 0) {
			const imageTypes = ['image/png', 'image/jpeg'];
			this.logger.debug('Getting thumb for a file ' + filename);
			if (!imageTypes.includes(type)) {
				this.logger.error(`Thumb requested for ${filepath} (${filename}) which is not an image (${type})`);
				throw new BadRequestException(
					`Can not generate thumb because file (type=${type}) is not an image (${imageTypes})`,
				);
			}
			filepath = await this.getThumb(filepath, thumbSize);
			filename = `thumb_${thumbSize}_${filename}`;
		}

		return { filepath, filename, contentType: type, size };
	}

	/**
	 * Generates thumbnail for the image
	 * @param filename
	 * @param size
	 */
	async getThumb(filename: string, size: number) {
		if (size < MIN_THUMB_SIZE || size > MAX_THUMB_SIZE) {
			this.logger.error(`Thumb size ${size} is out of bounds (${filename})`);
			throw new BadRequestException(`Can not generate thumb because size if out of bounds (${size})`);
		}

		try {
			const image = await Jimp.read(filename);

			const thumbName = `${filename}_${size}.thumb`;
			if (fs.existsSync(thumbName)) {
				this.logger.debug(`Found existing thumb ${thumbName}`);
				return thumbName;
			} else {
				this.logger.debug(`Generating new thumb ${thumbName}`);
				const thumb = image.contain(size, size);
				await thumb.writeAsync(thumbName);
				return thumbName;
			}
		} catch (e) {
			this.logger.error(`Image read failed ${e}`);
			throw new InternalServerErrorException(`Image read failed ${e}`);
		}
	}
}
