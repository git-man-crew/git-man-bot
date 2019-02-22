import { Injectable, Logger } from '@nestjs/common';
import { EnvConfig } from 'src/common/shared/env-config';
import { readFileSync } from 'fs';
import { parse } from 'dotenv';
import { BotConfiguration } from 'botframework-config';

@Injectable()
export class ConfigService {
  /**
   * Environment configuration object like special API keys and so on
   */
  private envConfig: EnvConfig;

  private botConfig: BotConfiguration;
  constructor(filePath: string) {
    this.envConfig = parse(readFileSync(filePath));
    this.initBotConfiguration();
  }

  public findBotConfiguration(BOT_CONFIGURATION: string): any {
    return this.botConfig.findServiceByNameOrId(BOT_CONFIGURATION);
  }

  private initBotConfiguration() {
    try {
      this.botConfig = BotConfiguration.loadSync(
        `config/${this.envConfig.botFilePath}`,
        process.env.botFileSecret,
      );
    } catch (err) {
      Logger.error(
        `\nError reading bot file. Please ensure you have valid botFilePath and botFileSecret set for your environment.`,
      );
      Logger.error(
        `\n - The botFileSecret is available under appsettings for your Azure Bot Service bot.`,
      );
      Logger.error(
        `\n - If you are running this bot locally, consider adding a .env file with botFilePath and botFileSecret.`,
      );
      Logger.error(
        `\n - See https://aka.ms/about-bot-file to learn more about .bot file its use and bot configuration.\n\n`,
      );
      process.exit();
    }
  }
}
