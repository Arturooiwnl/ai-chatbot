<div align="center">

# AI Chatbot

An **multimodal chatbot** built with [Next.js](https://nextjs.org/), [Vercel AI SDK](https://sdk.vercel.ai/), and [Vercel AI Elements](https://sdk.vercel.ai/docs/ai-elements).  
It uses **Google’s models** as the provider, with streaming, reasoning, and tools integration.

</div>

---

## Features

- **Multimodal**: Manages text and other modalities.
- **Reasoning Support**: Uses Google Gemini's reasoning mode.
- **Web Search and Context Tools**: Integrated with:
    - `url_context` for relevant web context
    - `google_search` for real-time search queries.
- **Tech Stack**:
    - [Next.js 15](https://nextjs.org/)
    - [Vercel AI SDK](https://sdk.vercel.ai/) (`ai`, `@ai-sdk/react`, `@ai-sdk/google`)
    - [TailwindCSS 4](https://tailwindcss.com/)
    - [Vercel AI Elements](https://ai-sdk.dev/elements/overview)
    - [shadcn/ui](https://ui.shadcn.com/)
---

## Running locally

You will need to use the environment variables defined in [.env.example](./.env.example) to run the Chatbot.
Get an API key in https://aistudio.google.com/apikey:

- Create a `.env.local` file and add your Google API credentials:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

- Install dependencies:

```bash
pnpm install
```

- Run the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.

---
