# VAL Demo V0

A React TypeScript application built with Vite, featuring interactive story experiences.

## Features

- Interactive story interface
- Multiple character themes (Eren, Mikasa)
- Audio, video, and image resources
- Responsive design
- TypeScript support

## Project Structure

```
src/
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── config/              # Character and story configurations
│   ├── erenConfig.ts
│   └── mikasaConfig.ts
├── themes/              # Theme configurations
│   ├── colorThemes.ts
│   ├── erenTheme.ts
│   └── mikasaTheme.ts
├── storyConfig.ts       # Story configuration
└── styles/              # CSS files
    ├── index.css
    └── style.css

public/
└── resources/           # Media resources
    ├── Akuma-no-Ko/     # Audio, video, images for Akuma-no-Ko theme
    └── Under-the-tree/  # Audio, video, images for Under-the-tree theme
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/leo-Zhizhu/VAL-demo.git
cd VAL-demo/demoV0
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies Used

- React 19.1.1
- TypeScript 5.8.3
- Vite 7.1.7
- CSS3

## License

This project is private and for demonstration purposes.

