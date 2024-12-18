# Invideo Assignment

## Navigation
- /api containes the BACKEND code written in Elixir
- /backend containes the Rust wasm backend for the REACT app
- Root is a VITE project

### POINTS

-  VITE 6.0 didn't yet support wasm hence had to switch to a older version...
1)  Elixir is deployed on a free serverless instance, hence might be a bit slow
2)  I have added fallback shader in text to shader generation, in case the previous one fails to render.
3)  THE ACCURACY IS STILL PRETTY LOW FOR TEXT TO Shader generation

## DEPLOYMENT

Deployed Backend can be queried by -

```
curl -X POST https://invideo-assignment-1.onrender.com/api/generate_content \
          -H "Content-Type: application/json" \
          -d '{"text": "GIve me an extraordinary game of life animated pattern"}'
```

Frontend - [https://invideo-assignment-l4gm.vercel.app/](https://invideo-assignment-l4gm.vercel.app/)

## Scripts 

To run deployment on local machine ( presuming ELIXIR and Pheonix is isntalled )
```
chmod +x ./scripts/*.sh
```

This will run the backend instance -
```
./backend.sh
```

This will build and compile wasm functions -
```
pnpm run dev:wasm
```

## SCREENSHOTS

![Screenshot_2024-12-18_17 43 26](https://github.com/user-attachments/assets/504594c5-7b3e-4b80-828b-478cc547aad1)
![Screenshot_2024-12-18_17 43 30](https://github.com/user-attachments/assets/57e6c419-b7c2-4![Screenshot_2024-12-18_17 43 41](https://github.com/user-attachments/assets/9393ba17-ed94-4e7a-9f09-d7b590a75ab7)
c97-b93a-16940987c87e)

