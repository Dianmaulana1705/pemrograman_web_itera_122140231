import { TodoManager } from "./TodoManager.js";
import { WeatherService } from "./WeatherService.js";

// Inisialisasi aplikasi
const todoManager = new TodoManager();
const weatherService = new WeatherService();

// Tampilkan cuaca
weatherService.displayWeather("Jakarta");

// Konfigurasi aplikasi
const appConfig = {
  version: "1.0",
  init() {
    console.log(`Aplikasi versi ${this.version} dimulai`);
  }
};
appConfig.init();