# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

# CodeSage UI

This is the frontend application for CodeSage, built with React, TypeScript, and Vite.

## WebSocket Implementation

The application includes a WebSocket implementation for real-time communication with the backend:

### Core Components

- **WebSocket Models** (`src/api/models/websocket.ts`): Defines TypeScript interfaces for all WebSocket event types.
- **WebSocket Service** (`src/api/websocket.ts`): Main service that handles WebSocket connections, authentication, reconnection, and message routing.
- **React Hook** (`src/hooks/useWebSocket.ts`): React hook for using WebSockets in components.
- **Context Providers**:
  - `TaskWebSocketProvider`: Provider for task-related WebSocket events.
  - `ChatWebSocketProvider`: Provider for chat-related WebSocket events.

### Authentication

The WebSocket implementation uses JWT authentication. The token is sent via the `Sec-WebSocket-Protocol` header during connection establishment:

```typescript
// Pass authentication token via Sec-WebSocket-Protocol header
// Format: "codesage.json,Bearer <base64_token>"
this.socket = new WebSocket(url, protocol);
```

### Chat History Synchronization

For chat WebSockets, you can specify a `lastMessageId` to receive all messages since that point:

```typescript
// Connect to chat with last message ID to get message history
websocketService.connectToChat(projectId, chatId, lastMessageId);
```

The backend will send all messages since the specified message ID before starting the real-time stream.

### Usage

To use WebSockets in a component:

```tsx
// For tasks
import {
  TaskWebSocketProvider,
  useTaskWebSocket,
} from "@/components/tasks/task-websocket-provider";

function TaskComponent({ projectId, taskId }) {
  return (
    <TaskWebSocketProvider projectId={projectId} taskId={taskId}>
      <TaskContent />
    </TaskWebSocketProvider>
  );
}

function TaskContent() {
  const { isConnected, sendMessage, taskState, lastMessage } =
    useTaskWebSocket();

  // Use WebSocket data and functions
  return <div>...</div>;
}
```

```tsx
// For chats
import {
  ChatWebSocketProvider,
  useChatWebSocket,
} from "@/components/chats/chat-websocket-provider";

function ChatComponent({ projectId, chatId, lastMessageId }) {
  return (
    <ChatWebSocketProvider
      projectId={projectId}
      chatId={chatId}
      lastMessageId={lastMessageId}
    >
      <ChatContent />
    </ChatWebSocketProvider>
  );
}

function ChatContent() {
  const { isConnected, sendMessage, chatState } = useChatWebSocket();

  // Use WebSocket data and functions
  return <div>...</div>;
}
```

## Component Architecture

The CodeSage UI follows a well-organized component architecture with clear separation of concerns:

### Application Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui design system components
│   ├── layout/         # Layout-specific components
│   ├── tasks/          # Task-related components
│   ├── projects/       # Project-related components
│   ├── results/        # Results display components
│   └── auth/           # Authentication components
├── pages/              # Page-level components
├── layouts/            # Layout wrappers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── api/                # API client and models
```

### Core Application Flow

#### Main App (`src/App.tsx`)

The root component that sets up routing:

- **Login Route**: Unauthenticated users see the login page
- **Protected Routes**: Authenticated users see the main application wrapped in `CodeAnalysisLayout`

#### Layout System (`src/layouts/sidebar/`)

The main layout provides the application shell:

- **`CodeAnalysisLayout`**: Main layout wrapper that provides sidebar and header
- **`CleanSidebar`**: Navigation sidebar with project navigation and user menu
- **`SiteHeader`**: Top header with breadcrumbs, search, and theme toggle

### Page Components and Their Purpose

#### 1. **Homepage** (`src/pages/homepage/`)

Dashboard showing user's overview:

- **`projects-list.tsx`**: Grid/list view of user's projects with creation dialog
- **`activity-feed.tsx`**: Recent activity across projects
- **`notifications.tsx`**: User notifications and alerts

#### 2. **Projects** (`src/pages/projects/`)

Project management interface:

- **`projects-table.tsx`**: Tabular view of projects with sorting, filtering, actions
- **`projects-list.tsx`**: Card-based project listing
- **`project-analytics.tsx`**: Analytics and metrics for projects

#### 3. **Individual Project** (`src/pages/project/`)

Single project view with multiple sections:

- **`project-details.tsx`**: Basic project information and metadata
- **`project-tasks.tsx`**: List of tasks within the project, launches task dialogs
- **`project-skeleton.tsx`**: Loading state for project data
- **`project-error.tsx`**: Error state handling

#### 4. **Project Settings** (`src/pages/project/settings/`)

Project configuration interface:

- **`project-general.tsx`**: Basic project settings
- **`project-integrations.tsx`**: Manage project integrations (GitHub, GitLab, etc.)
- **`add-integration-binding-dialog.tsx`**: Dialog for adding new integration bindings

#### 5. **Account** (`src/pages/account/`)

User account management:

- **`user-info.tsx`**: Personal information editing
- **`security.tsx`**: Security settings, password changes
- **`integrations.tsx`**: User-level integrations
- **`delete-account.tsx`**: Account deletion interface
- **`password-dialog.tsx`**: Password change dialog

#### 6. **Integrations** (`src/pages/integrations/`)

Integration management:

- **`integrations-list.tsx`**: List of available and configured integrations
- **`integration-creation-dialog.tsx`**: Dialog for setting up new integrations

#### 7. **Login** (`src/pages/login/`)

Authentication interface:

- **`login-form.tsx`**: Login form with validation

### Feature Components

#### Task Management (`src/components/tasks/`)

Handles task-related functionality:

- **`task-dialog.tsx`**: Main task viewing interface
- **`task-details.tsx`**: Detailed task information and controls
- **`task-message.tsx`**: Individual task messages with markdown support
- **`task-result-display.tsx`**: Displays task execution results

#### Results Display (`src/components/results/`)

Shows different types of task results:

- **`index.tsx`**: Main results router component
- **`environment-setup.tsx`**: Environment setup results
- **`tool-analysis.tsx`**: Tool analysis results
- **`initial-scan-supervisor.tsx`**: Initial scan results
- **`repo-scanner.tsx`**: Repository scanning results

#### Project Components (`src/components/projects/`)

- **`project-creation-dialog.tsx`**: Dialog for creating new projects

#### Authentication (`src/components/auth/`)

- **`login-modal.tsx`**: Modal login interface

### Shared Components

#### Layout Components (`src/components/layout/`)

- **`site-header.tsx`**: Application header with navigation and controls
- **`app-breadcrumbs.tsx`**: Dynamic breadcrumb navigation

#### Utility Components

- **`theme-provider.tsx`**: Dark/light theme context provider
- **`state-button.tsx`**: Button with loading/success/error states
- **`markdown.tsx`**: Markdown rendering component
- **`mode-toggle.tsx`**: Theme toggle switch

### UI Components (`src/components/ui/`)

Based on shadcn/ui design system, heavily used throughout:

**Core Components:**

- `button`, `input`, `card`, `dialog`, `form`
- `table`, `badge`, `avatar`, `skeleton`
- `select`, `checkbox`, `tabs`

**Navigation:**

- `sidebar`, `breadcrumb`, `dropdown-menu`

**Data Display:**

- `chart`, `tooltip`, `progress`, `separator`

**Layout:**

- `sheet`, `drawer`, `scroll-area`, `collapsible`

### Component Interconnections

#### Data Flow

1. **Authentication**: `LoginModal` → `ProtectedRoute` → Main App
2. **Navigation**: `CleanSidebar` navigates between pages
3. **Project Flow**: Homepage → Projects List → Individual Project → Tasks
4. **Task Execution**: Project Tasks → Task Dialog → Task Details → Results Display
5. **Settings**: Project → Settings → Various configuration dialogs

#### Shared State

- **Theme**: `ThemeProvider` provides theme context globally
- **User Context**: User information flows from layout to components
- **WebSocket**: Real-time updates for tasks and chats
- **API State**: React Query manages server state across components

#### Component Reuse

- **StateButton**: Used in forms across login, project creation, user settings
- **UI Components**: Extensively reused across all pages and dialogs
- **Card Layouts**: Consistent card-based UI across pages
- **Form Patterns**: Consistent form handling across dialogs

### Unused Components

The following components appear to be unused and could be removed:

- `chart-area-interactive.tsx`, `section-cards.tsx`, `data-table.tsx`
- `user-details.tsx`, `app-sidebar.tsx` (replaced by layout/sidebar)
- Legacy navigation components: `nav-main.tsx`, `nav-secondary.tsx`, `nav-documents.tsx`

This architecture provides good separation of concerns, reusability, and maintainability while following React best practices.

## Development

### Installation

```bash
pnpm install
```

### Running the Development Server

```bash
pnpm dev
```

### Building for Production

```bash
pnpm build
```

## License

Proprietary - All rights reserved
