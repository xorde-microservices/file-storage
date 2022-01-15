import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "../../common/base.service";
import { j, v } from "../../common/log.utils";
import * as fs from "fs";
import { FileUploadResponseDto } from "./dto/upload.dto";
import { IFileRetrieval } from "./interfaces/file.retrieval";
import { filesConfig } from "./files.config";

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

	async retrieveFile(fileId: string): Promise<IFileRetrieval> {
		const filepath = filesConfig().files.uploadDir + "/" + fileId;
		const jsonFilename = filepath + ".json";

		if (!fs.existsSync(jsonFilename)) {
			this.logger.error("Not found " + fileId);
			throw new NotFoundException("")
		}

		this.logger.log("Retrieve " + fileId);

		const jsonMetadata = JSON.parse(
			(await fs.promises.readFile(jsonFilename)).toString(),
		);
		const contentType = jsonMetadata["mimetype"];
		const size = jsonMetadata["size"];
		const filename = jsonMetadata["originalname"];
		return { filepath, filename, contentType, size };
	}
}
