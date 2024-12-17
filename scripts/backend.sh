cd api

read -p "Enter your Gemini API key: " GEMINI_API

export GEMINI_API

echo "Gemini API key has been exported as an environment variable."

echo "Current Gemini API key: $GEMINI_API"

mix deps.get

mix phx.server
