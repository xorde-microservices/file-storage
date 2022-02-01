import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { BaseService } from "../../common/base.service";
import { j, v } from "../../common/log.utils";
import * as fs from "fs";
import { FileUploadResponseDto } from "./dto/upload.dto";
import { IFileRetrieval } from "./interfaces/file.retrieval";
import { filesConfig } from "./files.config";
import Jimp from "jimp/es";

export const MAX_THUMB_SIZE = 256;
export const MIN_THUMB_SIZE = 16;

@Injectable()
export class FilesService extends BaseService {
	async uploadFile(
		file: Express.Multer.File,
		userId: string,
	): Promise<FileUploadResponseDto> {
		this.logger.log("Upload " + v(file));
		const timestamp = new Date().getTime();
		await fs.promises.writeFile(
			file.path + ".json",
			j({ ...file, userId, timestamp }),
		);
		return new FileUploadResponseDto(file.filename, file.size);
	}

	async retrieveFile(
		fileId: string,
		thumbSize: number,
	): Promise<IFileRetrieval> {
		let filepath = filesConfig().files.uploadDir + "/" + fileId;
		const jsonFilename = filepath + ".json";

		if (!fs.existsSync(jsonFilename)) {
			this.logger.error("Not found " + fileId);
			throw new NotFoundException("");
		}

		this.logger.log("Retrieve " + v({ fileId, thumbSize }));

		const jsonMetadata = JSON.parse(
			(await fs.promises.readFile(jsonFilename)).toString(),
		);
		const contentType = jsonMetadata["mimetype"];
		let filename = jsonMetadata["originalname"];

		if (thumbSize > 0) {
			this.logger.debug("Getting thumb for a file " + filename);
			if (!["image/png", "image/jpeg"].includes(contentType)) {
				this.logger.error(
					`Thumb requested for ${filepath} (${filename}) which is not an image (${contentType})`,
				);
				throw new BadRequestException(
					`Can not generate thumb because file is not an image (${contentType})`,
				);
			}
			filepath = await this.getThumb(filepath, thumbSize);
			filename = `thumb_${thumbSize}_${filename}`;
		}

		const size = jsonMetadata["size"];
		return { filepath, filename, contentType, size };
	}

	/* quick and dirty implementation of generating thumbnails */
	async getThumb(filename: string, size: number) {
		if (size < MIN_THUMB_SIZE || size > MAX_THUMB_SIZE) {
			this.logger.error(`Thumb size ${size} is out of bounds (${filename})`);
			throw new BadRequestException(
				`Can not generate thumb because size if out of bounds (${size})`,
			);
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
