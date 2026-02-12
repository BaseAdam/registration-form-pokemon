# Pokemon Registration - Next.js Registration Form

A modern, responsive registration form built with Next.js App Router, React, TypeScript, and Styled Components (Emotion).

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the registration form.

### Build for Production

```bash
npm run build
npm start
```

## Testing

```bash
npm run test
```

## Docker

### Prerequisites

- Docker installed on your system
- Docker Compose installed

### Quick Start with Docker Compose

The easiest way to run the application with Docker:

1. Build and start the container:

```bash
docker-compose up
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the registration form.

**Docker Compose Commands:**

- **Start the application:**

  ```bash
  docker-compose up
  ```

- **Stop the application:**

  ```bash
  docker-compose down
  ```

- **Rebuild and start:**
  ```bash
  docker-compose up --build
  ```

### Building and Running with Docker (Manual)

1. Build the Docker image:

```bash
docker build -t pokemon-registration .
```

2. Run the container:

```bash
docker run -p 3000:3000 pokemon-registration
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the registration form.

**Docker Commands:**

- **Build the image:**

  ```bash
  docker build -t pokemon-registration .
  ```

- **Run the container:**

  ```bash
  docker run -p 3000:3000 pokemon-registration
  ```

- **Stop the container:**

  ```bash
  docker stop pokemon-app
  ```

- **Remove the container:**

  ```bash
  docker rm pokemon-app
  ```

## Project Structure

```
pokemon-registration/
├── app/
│   ├── layout.tsx          # Root layout component with Emotion registry
│   ├── page.tsx             # Home page with registration form
│   └── globals.css          # Global styles
├── components/
├── lib/
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```
