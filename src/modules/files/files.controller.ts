import {
	BadRequestException,
	Controller,
	Get,
	InternalServerErrorException,
	Param,
	Post,
	Query,
	Request,
	Res,
	StreamableFile,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadDto, FileUploadResponseDto } from "./dto/upload.dto";
import { FilesService } from "./files.service";
import { FileRetrieveArgs, FileRetrieveParams } from "./dto/retrieve.dto";
import { createReadStream } from "fs";
import { validate } from "class-validator";

@Controller("files")
@ApiTags("files")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FilesController {
	constructor(private readonly service: FilesService) {}

	@ApiOperation({
		description: "Retrieves uploaded file",
		summary: "Retrieve file",
	})
	@ApiParam({
		name: "id",
		required: true,
		description: "Valid ID of previously uploaded file",
		allowEmptyValue: false,
	})
	@Get(":id")
	async getFile(
		@Res({ passthrough: true }) res,
		@Param() params: FileRetrieveParams,
		@Query() args: FileRetrieveArgs,
	): Promise<StreamableFile> {
		// lets do forced validation of the params
		const validationErrors = await validate(new FileRetrieveParams(params.id));
		if (validationErrors.length > 0) {
			throw new BadRequestException(validationErrors, "Bad parameters");
		}

		const metadata = await this.service.retrieveFile(
			params.id,
			Number(args.thumb || 0),
		);

		res.set({
			"Content-Type": metadata.contentType,
			"Content-Disposition": `attachment; filename="${metadata.filename}"`,
		});

		try {
			const file = createReadStream(metadata.filepath);
			return new StreamableFile(file);
		} catch (e) {
			throw new InternalServerErrorException(`Failed to read filestream`);
		}
	}

	@ApiOperation({
		description: "Uploads a file and returns file UID",
		summary: "Upload file",
	})
	@UseInterceptors(FileInterceptor("file"))
	@ApiConsumes("multipart/form-data")
	@ApiOkResponse({ type: FileUploadResponseDto })
	@ApiBody({
		description: "File DTO",
		type: FileUploadDto,
	})
	@Post("")
	async uploadFile(
		@Request() req,
		@UploadedFile() file: Express.Multer.File,
	): Promise<FileUploadResponseDto> {
		return this.service.uploadFile(file, req.user?.userId);
	}
}
