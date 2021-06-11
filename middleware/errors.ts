export class ErrorHandler {
  hasResource(request): Object {
    try {
      let response = request ?? {
        statusCode: 404,
        message: 'Resource not found',
      };
      return response;
    } catch (error) {
      return { message: 'An error occured' };
    }
  }
}
