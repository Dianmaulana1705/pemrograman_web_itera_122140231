/**
 * Class untuk mengelola data cuaca
 */
export class WeatherService {
    #config = {
      apiKey: "YOUR_API_KEY", // Ganti dengan API key OpenWeatherMap
      baseUrl: "https://api.openweathermap.org/data/2.5/weather"
    };
  
    /**
     * Mengambil data cuaca
     * @param {string} city - Nama kota
     * @returns {Promise<Object>} Data cuaca
     */
    fetchWeather = async (city = "Jakarta") => {
      // Fallback data statis jika API key tidak ada
      if (this.#config.apiKey === "YOUR_API_KEY") {
        return {
          temperature: 27,
          description: "Cerah"
        };
      }
      try {
        const response = await fetch(
          `${this.#config.baseUrl}?q=${city}&appid=${this.#config.apiKey}&units=metric`
        );
        if (!response.ok) throw new Error("Gagal mengambil data cuaca");
        const { main: { temp }, weather } = await response.json();
        return {
          temperature: temp,
          description: weather[0].description
        };
      } catch (error) {
        console.error(error);
        return { temperature: "N/A", description: "Gagal memuat cuaca" };
      }
    };
  
    /**
     * Menampilkan cuaca ke DOM
     * @param {string} city - Nama kota
     */
    displayWeather = async (city) => {
      const weatherInfo = document.getElementById("weatherInfo");
      const data = await this.fetchWeather(city);
      weatherInfo.innerHTML = `
        <p>Suhu di ${city}: ${data.temperature}°C</p>
        <p>Kondisi: ${data.description}</p>
      `;
    };
  }