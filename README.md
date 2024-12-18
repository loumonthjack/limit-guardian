# Limit Guardian

A TypeScript library for monitoring and enforcing API rate limits. Features CLI tools and real-time monitoring to help prevent excessive API usage and control costs.

## Features

- 🚀 Rate limit monitoring for multiple APIs
- 🔄 Automatic usage tracking
- ⏰ Configurable reset periods
- 🛠️ CLI tools for management
- 📊 GraphQL API for integration
- 🔔 Email notifications

## Technologies

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [BullMQ](https://github.com/OptimalBits/bullmq)
- [GraphQL](https://graphql.org/)
- [Express](https://expressjs.com/)
- [Bull Board](https://github.com/RomanKutlak/bull-board)
- [Redis](https://redis.io/)
- [SQLite](https://sqlite.org/)

## Installation

```bash
npm install limit-guardian 
```

## Quick Start

1. Initialize your database:
```bash
npx prisma migrate dev
```

2. Start the monitoring service:
```bash
npm run monitor
```

## Usage

### As a Library

```typescript
import { Guardian, GuardianConfig } from "limit-guardian";

// Initialize the guardian
const guardian = Guardian.getInstance();

// Create a protected API call
const fetchAnthropicData = async () => {
  const guardedAnthropic = await guardian.protect(
    "anthropic",
    await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: maxTokens,
      messages: [{ role: "user", content }],
    }),
    {
      interval: "minute",
      limit: 10,
      strict: true,
      to: "admin@example.com"
    },
  );
  const messages = await guardedAnthropic;
  const [response] = messages.content;
  return response.text;
};

// Using with a wrapper function
const guardEndpoint = <T>(
  name: string,
  callable: T,
  config: GuardianConfig,
) => {
  try {
    return guardian.protect(name, callable, {
      ...config,
      to: "admin@example.com",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Usage example
const result = await guardEndpoint(
  "openai-api",
  async () => fetch("https://api.openai.com/v1/chat/completions"),
  {
    interval: "minute",
    limit: 100,
    strict: true
  }
);
```

### CLI Commands

View Commands:
```bash
# List all services
npm run cli view all

# View specific service
npm run cli view service openai-api
```

Update Commands:
```bash
# Enable/disable service
npm run cli update status openai-api --enable
npm run cli update status openai-api --disable

# Update service limit
npm run cli update limit openai-api 1000 --period month

# Update service usage
npm run cli update usage openai-api 50
```

### Admin Interfaces

#### Prisma Studio (Database UI)
Access and manage your database through a convenient web interface:
```bash
npx prisma studio
```
This will open a browser window at `http://localhost:5555` where you can view and edit your database records.

#### Bull Board (Worker Queue UI)
Monitor and manage your background jobs through Bull Board:
```bash
npm run worker-ui
```
This will start the Bull Board interface at `http://localhost:7124/queues` where you can:
- View active, completed, and failed jobs
- Retry failed jobs
- Clear queues
- Monitor job progress
- View job details and stack traces

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/loumonthjack/limit-guardian.git
cd limit-guardian
```

2. Install dependencies:
```bash
npm install
```

3. Copy the .envrc.example file to .envrc and set the environment variables, (Suggest using [direnv](https://direnv.net/) to manage environment variables):
```bash
cp .envrc.example .envrc
```

4. Initialize the database:
```bash
npm run migrate
```

5. Start development server:
```bash
npm run dev
```

## Using as a Local Package

1. In your project directory, create a local package link:
```bash
cd limit-guardian
npm link
```

2. In your application directory, link to the package:
```bash
cd your-application
npm link limit-guardian
```

3. Import and use in your application:
```typescript
import { Guardian } from "limit-guardian";

const guardian = Guardian.getInstance();
```

## Configuration

The Guardian accepts the following configuration options:

```typescript
type GuardianConfig = {
  interval: "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
  limit: number;
  strict: boolean;
  to?: string;
};
```

- `interval`: The period for rate limiting
- `limit`: Maximum number of calls allowed in the interval
- `strict`: If true, throws error when limit is reached and sends notification. If false, allows requests but sends warning notification
- `to`: Email address for notifications

## Error Handling

The Guardian throws typed errors:

```typescript
type GuardianError = {
  message: string;
  code: "RATE_LIMIT_EXCEEDED" | "SERVICE_DISABLED" | "SERVICE_NOT_FOUND";
  service: string;
  limit: number;
  usage: number;
  resetAt: Date;
};
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request