export interface MetadataInterface extends Express.Multer.File {
	userid: string;
	timestamp: number;
}
