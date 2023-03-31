import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

/**
 * Функция запуска сервера
 */
async function start() {
    const PORT = process.env.PORT || 8000;
    const app = await NestFactory.create(AppModule);

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();