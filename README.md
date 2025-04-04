# Motobike Rescue Admin

Admin dashboard for the Motobike Rescue application.

## Features

- Device management with map visualization
- Real-time device tracking
- User management
- Role-based access control

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/motobike-rescue-admin.git
   cd motobike-rescue-admin
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Code Quality

### Linting

This project uses ESLint and Prettier for code quality and formatting.

To run the linter:

```bash
npm run lint
# or
yarn lint
```

To automatically fix linting issues:

```bash
npm run lint:fix
# or
yarn lint:fix
```

To format code with Prettier:

```bash
npm run format
# or
yarn format
```

### Git Hooks

This project uses Husky to enforce code quality checks before commits. The following checks are run automatically:

- ESLint checks on staged `.js`, `.jsx`, `.ts`, and `.tsx` files
- Prettier formatting on staged files
- Type checking with TypeScript

These checks help maintain code quality and consistency throughout the project. If any check fails, the commit will be blocked until the issues are fixed.

#### Troubleshooting Husky Issues

If you encounter issues with Husky, try the following:

1. **"eslint: command not found" error**:

   - Make sure you've installed all dependencies with `npm install`
   - Try running `npm run prepare` to reinstall Husky hooks
   - Check that the lint-staged configuration in package.json uses `npx eslint` instead of just `eslint`

2. **Hooks not running**:

   - Ensure the `.husky` directory exists and contains the pre-commit file
   - Make sure the pre-commit file is executable (`chmod +x .husky/pre-commit`)
   - Try running `npm run prepare` to reinstall Husky hooks

3. **ESLint configuration issues with ES modules**:

   - If you see an error about `require() of ES Module`, make sure the ESLint configuration file uses the `.cjs` extension
   - This is necessary because the project is configured as an ES module with `"type": "module"` in package.json

4. **Test Husky setup**:
   - Run `npm run test:husky` to verify that Husky is working correctly

## Docker Deployment

### Building the Docker Image

```bash
npm run docker:build
# or
yarn docker:build
```

### Running the Docker Container

```bash
npm run docker:run
# or
yarn docker:run
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions
- `src/interfaces/` - TypeScript interfaces

## License

This project is licensed under the MIT License - see the LICENSE file for details.
