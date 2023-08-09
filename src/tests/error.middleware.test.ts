import { NextFunction, Request, Response } from 'express';
import { errorMiddleware } from '../middlewares/error.middleware';
import { HttpException } from '../interfaces/http-exception';

describe('Error middleware', () => {
  it('should respond with the correct status and message HttpException', () => {
    const httpException: HttpException = {
      name: 'HttpException',
      status: 404,
      message: 'Not found',
    };
    const request: Partial<Request> = {};
    const response: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next: NextFunction = jest.fn();

    errorMiddleware(
      httpException,
      request as Request,
      response as Response,
      next
    );

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      status: 404,
      message: 'Not found',
    });
  });
});
