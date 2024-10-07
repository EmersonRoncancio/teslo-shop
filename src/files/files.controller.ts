import {
  Controller,
  // FileTypeValidator,
  HttpStatus,
  // ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileName } from './helpers/fileName.helper';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Carga de archivos')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/uploads',
        filename: FileName,
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      // new ParseFilePipe({
      //   validators: [new FileTypeValidator({ fileType: 'image/png' })],
      // }),
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'png' })
        .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    file: Express.Multer.File,
  ) {
    console.log(this.configService.get('db_password'));
    console.log(file);
    return {
      ok: true,
      message: 'Se subio con exito',
    };
  }
}
