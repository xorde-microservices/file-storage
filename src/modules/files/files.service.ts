import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "../../common/base.service";
import { j, v } from "../../common/log.utils";
import * as fs from "fs";
import { FileUploadResponseDto } from "./dto/upload.dto";
import { IFileRetrieval } from "./interfaces/file.retrieval";
import { filesConfig } from "./files.config";
import Jimp from 'jimp/es';

@Injectable()
export class FilesService extends BaseService {
	async uploadFile(
		file: Express.Multer.File,
		userId: string,
	): Promise<FileUploadResponseDto> {
		this.logger.log("Upload " + v(file));
		const timestamp = new Date().getTime();
		const jsonFile = await fs.promises.writeFile(
			file.path + ".json",
			j({ ...file, userId, timestamp }),
		);
		return new FileUploadResponseDto(file.filename, file.size);
	}

	async retrieveFile(fileId: string, thumbSize: number): Promise<IFileRetrieval> {
		let filepath = filesConfig().files.uploadDir + "/" + fileId;
		const jsonFilename = filepath + ".json";

		if (!fs.existsSync(jsonFilename)) {
			this.logger.error("Not found " + fileId);
			throw new NotFoundException("")
		}

		this.logger.log("Retrieve " + v({ fileId, thumbSize }));

		const jsonMetadata = JSON.parse(
			(await fs.promises.readFile(jsonFilename)).toString(),
		);
		const contentType = jsonMetadata["mimetype"];
		let filename = jsonMetadata["originalname"];

		if (thumbSize > 0) {
			this.logger.debug("Getting thumb for a file " + filename);
			if (contentType != 'image/png') {
				throw new BadRequestException("Can not generate thumb because file is not an image");
			}
			filepath = await this.getThumb(filepath, thumbSize);
			filename = `thumb_${thumbSize}_${filename}`;
		}

		const size = jsonMetadata["size"];
		return { filepath, filename, contentType, size };
	}

	/* quick and dirty implementation of generating thumbnails */
	async getThumb(filename: string, size: number) {
		const image = await Jimp.read(filename);
		const thumbName = `${filename}_${size}.thumb`;

		if (fs.existsSync(thumbName)) {
			this.logger.debug(`Found existing thumb ${thumbName}`);
			return thumbName;
		} else {
			this.logger.debug(`Generating new thumb ${thumbName}`);
			await image.contain(size, size).writeAsync(thumbName);
			return thumbName;
		}
	}
}
