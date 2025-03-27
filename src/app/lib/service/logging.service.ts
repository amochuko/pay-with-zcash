// LoggerService for app logs
class LoggerService {
  // TODO: implementattion needed
  log(message: string) {
    console.log(message);
  }
}

const loggerService = new LoggerService(); // use Singleton
export default loggerService;
