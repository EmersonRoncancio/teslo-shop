import { v4 as uuidv4 } from 'uuid';

export const FileName = (
  req: Express.Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function,
) => {
  if (!file) return callback(new Error('No se recibe archivo'), false);

  const extension = file.mimetype.split('/')[1];

  const fileName = `${uuidv4()}.${extension}`;

  callback(null, fileName);
};
