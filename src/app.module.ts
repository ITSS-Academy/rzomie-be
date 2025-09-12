import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { SupabaseModule } from './shared/supabase/supabase.module';
import { CvModule } from './domains/cv/cv.module';
import { CvThemeModule } from './domains/cv-theme/cv-theme.module';
import * as admin from 'firebase-admin';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration]
    }),
    // Import SupabaseModule globally
    SupabaseModule,
    CvModule,
    CvThemeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert("./firebase-admin-key.json"),
    })
  }
  
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('cv/gen-theme', 'cv/get-shared-cv/:id').forRoutes('*');
  }
  
}
