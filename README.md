# ReasonVerse

ReasonVerse is a modern web application for comparing and evaluating AI-generated responses to complex queries. It leverages dual LLMs (Large Language Models), a token reward system, and a clean, intuitive interface to foster critical thinking and multi-perspective reasoning.

---
![App ScreenShot]()
![Screenshot 2025-07-04 195518](https://github.com/user-attachments/assets/b9c539ba-3bbf-4fec-a418-68bef1fa6d1f)

## Features

- **Dual AI Query:**  
  Input a research question and receive responses from two distinct AI models, each with access to specialized tools and knowledge bases.

- **Comparative Display:**  
  View both AI responses side-by-side, with clear highlighting of reasoning and sources.

- **User Feedback & Preference:**  
  Select your preferred response, provide detailed feedback, and tag positive/negative aspects.

- **Token Reward System:**  
  Earn tokens for providing feedback and identifying high-quality reasoning.

- **Authentication:**  
  Secure login/signup for personalized experience and token tracking.

- **Modern UI/UX:**  
  Responsive, accessible, and visually appealing interface using Next.js, Tailwind CSS, and Radix UI components.

---

## Quick Start

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/reasonverse.git
cd ReasonVerse-master
npm install
```

### Development

```bash
npm run dev
```
The app will be available at [http://localhost:9002](http://localhost:9002) by default.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

- `src/app/` — Main app entry, layout, and global styles
- `src/components/` — UI components (e.g., Header, ReasoningPage, Cards, AuthForm)
- `src/ai/flows/` — AI workflow logic (generating, analyzing, and summarizing responses)
- `src/contexts/` — React context providers (e.g., authentication)
- `src/hooks/` — Custom React hooks (e.g., toast notifications)
- `src/lib/` — Utility functions

---

## Core Technologies

- **Next.js** — React framework for SSR, SSG, and API routes
- **TypeScript** — Type safety throughout the codebase
- **Tailwind CSS** — Utility-first CSS framework for rapid UI development
- **Radix UI** — Accessible, composable UI primitives
- **Firebase** — (Planned/optional) for authentication and data storage

---

## Customization

- **Theming:**  
  Easily adjust colors, fonts, and breakpoints in `tailwind.config.ts`.

- **AI Models:**  
  Add or swap LLMs in `src/ai/flows/` for different reasoning engines.

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## License

MIT

---

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Firebase](https://firebase.google.com/)

---

## Contact

For questions or feedback, please open an issue or contact the maintainer.
