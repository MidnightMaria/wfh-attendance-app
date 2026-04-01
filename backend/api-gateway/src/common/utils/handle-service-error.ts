import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

export function handleServiceError(error: unknown): never {
  const axiosError = error as AxiosError<any>;

  if (axiosError?.isAxiosError) {
    const status =
      axiosError.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const responseData = axiosError.response?.data;

    const message =
      responseData?.message ??
      axiosError.message ??
      'Unexpected service error';

    throw new HttpException(
      {
        statusCode: status,
        message,
        error: responseData?.error ?? 'Service Error',
      },
      status,
    );
  }

  throw new HttpException(
    {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unexpected gateway error',
      error: 'Internal Server Error',
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}