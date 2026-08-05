import httpx

from app.core.config import settings


class WeatherService:

    @staticmethod
    def get_weather(
        latitude: float | None = None,
        longitude: float | None = None,
    ):
        lat = latitude or settings.DEFAULT_LATITUDE
        lon = longitude or settings.DEFAULT_LONGITUDE

        if not settings.OPENWEATHER_API_KEY:
            return {
                "temp": 31,
                "condition": "Rain expected",
                "conditionHi": "बारिश संभावित",
                "rainChance": 78,
                "humidity": 82,
                "wind": 12,
                "impact": "Hold spraying — rain in 3 hrs",
                "impactHi": "छिड़काव रोकें — 3 घंटे में बारिश",
                "icon": "cloud-rain",
            }

        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "lat": lat,
            "lon": lon,
            "appid": settings.OPENWEATHER_API_KEY,
            "units": "metric",
        }

        try:
            response = httpx.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            temp = round(data["main"]["temp"])
            humidity = data["main"]["humidity"]
            wind = round(data["wind"]["speed"])
            weather_main = data["weather"][0]["main"].lower()
            description = data["weather"][0]["description"]

            # Map weather condition to rain chance and impact
            rain_chance = 0
            condition = description.title()
            condition_hi = description.title()
            impact = "Good weather for farm work"
            impact_hi = "खेती के काम के लिए अच्छा मौसम"
            icon = "sun"

            if "rain" in weather_main or "drizzle" in weather_main:
                rain_chance = 85
                condition = "Rain expected"
                condition_hi = "बारिश संभावित"
                impact = "Hold spraying — rain expected"
                impact_hi = "छिड़काव रोकें — बारिश संभावित"
                icon = "cloud-rain"
            elif "cloud" in weather_main:
                rain_chance = 30
                condition = "Cloudy"
                condition_hi = "बादल छाए"
                impact = "Good for transplanting"
                impact_hi = "रोपाई के लिए अच्छा"
                icon = "cloud"
            elif "clear" in weather_main:
                rain_chance = 5
                condition = "Clear sky"
                condition_hi = "साफ आसमान"
                impact = "Good for spraying"
                impact_hi = "छिड़काव के लिए अच्छा"
                icon = "sun"
            elif "thunderstorm" in weather_main:
                rain_chance = 95
                condition = "Thunderstorm"
                condition_hi = "आंधी-तूफान"
                impact = "Secure harvest immediately"
                impact_hi = "तुरंत कटाई सुरक्षित करें"
                icon = "cloud-lightning"

            return {
                "temp": temp,
                "condition": condition,
                "conditionHi": condition_hi,
                "rainChance": rain_chance,
                "humidity": humidity,
                "wind": wind,
                "impact": impact,
                "impactHi": impact_hi,
                "icon": icon,
            }

        except Exception:
            # Fallback to mock data on API failure
            return {
                "temp": 31,
                "condition": "Rain expected",
                "conditionHi": "बारिश संभावित",
                "rainChance": 78,
                "humidity": 82,
                "wind": 12,
                "impact": "Hold spraying — rain in 3 hrs",
                "impactHi": "छिड़काव रोकें — 3 घंटे में बारिश",
                "icon": "cloud-rain",
            }