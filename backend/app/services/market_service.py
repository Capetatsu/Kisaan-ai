class MarketService:

    # Fallback market data (used when no API key is configured)
    _FALLBACK = [
        {
            "id": 1,
            "crop": "Wheat",
            "cropHi": "गेहूं",
            "price": 2420,
            "unit": "quintal",
            "trend": "up",
            "change": 3.2,
            "suggestion": "sell",
            "emoji": "🌾",
        },
        {
            "id": 2,
            "crop": "Tomato",
            "cropHi": "टमाटर",
            "price": 1860,
            "unit": "quintal",
            "trend": "down",
            "change": 5.1,
            "suggestion": "hold",
            "emoji": "🍅",
        },
        {
            "id": 3,
            "crop": "Onion",
            "cropHi": "प्याज",
            "price": 3120,
            "unit": "quintal",
            "trend": "up",
            "change": 8.4,
            "suggestion": "sell",
            "emoji": "🧅",
        },
        {
            "id": 4,
            "crop": "Soybean",
            "cropHi": "सोयाबीन",
            "price": 4480,
            "unit": "quintal",
            "trend": "flat",
            "change": 0.3,
            "suggestion": "hold",
            "emoji": "🫘",
        },
    ]

    @staticmethod
    def get_market_prices():
        # For now, return fallback data.
        # A real mandi API (e.g., AGMARKNET) can be integrated here.
        return MarketService._FALLBACK

    @staticmethod
    def get_nearby_mandi():
        return {
            "name": "Sanwer Mandi",
            "distance": "8 km",
            "open": True,
        }