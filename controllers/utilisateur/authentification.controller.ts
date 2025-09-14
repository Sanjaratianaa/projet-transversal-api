import { Request, Response } from 'express';
import { AuthenticationService } from '../../services/authentification.service';

export const AuthenticationController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await AuthenticationService.authenticateUser(email, password);
    if (result.success) {
      res.json({ token: result.token, user: result.user });
    } else {
      res.status(401).json({ message: result.message });
    }
  },

  register: async (req: Request, res: Response) => {
    console.log(req.body);
    const result = await AuthenticationService.register(req.body);
    if (result.success) {
      res.status(201).json({ message: result.message, data: (result as any).data });
    } else {
      res.status(500).json({ message: result.message, data: (result as any).data });
    }
  },

  verifyToken: (req: Request, res: Response) => {
    const token = req.body.token;
    const result = AuthenticationService.verifyToken(token);
    if (result.success) {
      res.status(201).json({ success: true, user: result.user });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  },

  changePassword: async (req: Request, res: Response) => {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    const result = await AuthenticationService.changePassword(email, oldPassword, newPassword, confirmPassword);
    if (result.success) {
      res.status(201).json({ message: result.message, data: (result as any).data });
    } else {
      res.status(500).json({ message: result.message, data: (result as any).data });
    }
  }
};
