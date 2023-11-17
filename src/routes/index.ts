import express from 'express';
import UserController from '../modules/user/controllers/user.controller';
import AuthController from '../modules/auth/controllers/auth.controller';
import AuthService from '../modules/auth/services/auth.services';
import { uploadStorage } from '../utils';

const routes = express.Router();

routes.post('/user', UserController.create.bind(UserController));

routes.post(
  '/user/upload',
  (req, res, next) => AuthService.authenticate(req, res, next),
  uploadStorage().single('file'),
  UserController.upload.bind(UserController),
);

routes.post('/user/login', AuthController.login.bind(AuthController));

routes.put(
  '/user/quota',
  (req, res, next) => AuthService.authenticate(req, res, next),
  UserController.updateQuota.bind(UserController),
);

routes.get(
  '/user/files-data/:userId',
  (req, res, next) => AuthService.authenticate(req, res, next),
  UserController.getFilesData.bind(UserController),
);

routes.get(
  '/user/file/:fileId',
  (req, res, next) => AuthService.authenticate(req, res, next),
  UserController.getFileInfo.bind(UserController),
);

export default routes;
