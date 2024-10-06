# OpenAI Assistants Manager

[中文版 README](README_CN.md)

OpenAI Assistants Manager is a simple web application built with Next.js for managing and configuring your OpenAI Assistants. This lightweight tool provides an intuitive interface that allows you to easily view, edit, and update your AI assistants without any complex setup.

## Features

- Simple and straightforward interface
- View and manage all OpenAI Assistants
- Quickly edit assistant names, instructions, and models
- Easily adjust response format, temperature, and top_p parameters
- Secure API key management (client-side storage)
- Responsive design, supporting both desktop and mobile devices
- No backend required - runs entirely in the browser

## Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/okooo5km/openai-assistants-manager.git
   ```

2. Navigate to the project directory:

   ```bash
   cd openai-assistants-manager
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and visit:

   ```bash
   # On macOS
   open http://localhost:3000
   # On Windows
   start http://localhost:3000
   ```

## Deployment

### Vercel Deployment

This simple project can be easily deployed on Vercel with just a few clicks. Click the button below to deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fokooo5km%2Fopenai-assistants-manager)

### Netlify Deployment

You can also deploy this project on Netlify. Follow these steps:

1. Fork this repository to your GitHub account.
2. Log in to your Netlify account.
3. Click on "New site from Git".
4. Choose GitHub as your Git provider.
5. Select the forked repository.
6. In the "Build settings" section:
   - Set the build command to: `npm run build`
   - Set the publish directory to: `.next`
7. Click on "Deploy site".

Alternatively, you can click the button below for a quick deploy:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/okooo5km/openai-assistants-manager)

## Contributing

We welcome issues and pull requests to improve this simple project. If you have any suggestions or find a bug, please feel free to report it.

## License

[MIT License](LICENSE)

## Contact

If you have any questions or suggestions about this simple tool, please contact us through:

- Creating a GitHub issue
- Sending an email to: [okooo5km@gmail.com](mailto:okooo5km@gmail.com)

Thank you for using the OpenAI Assistants Manager!
