# SUVIDHA 2026 — Technical Reference

## Resources

- **Database**: Supabase (PostgreSQL), Firebase (Realtime Database)
- **Cache**: Redis (self-hosted or Upstash)
- **Message Queue**: RabbitMQ (self-hosted or Upstash)
- **Authentication**: JWT (JSON Web Tokens)

## Architecture

- **API Gateway**: Kong (handles routing, authentication, rate limiting)
- **Microservices**: Auth Service, Electricity Service, Payment Service, Complain Service (each responsible for specific domain logic)
- **Frontend**: React application for user interface

## Technologies
- **Backend**: Node.js, Express.js, Kong, RabbitMQ, Redis, Supabase, Firebase, JWT
- **Frontend**: React, Vite

## Deployment

- **Containerization**: Docker for consistent environments
- **Orchestration**: Kubernetes for scaling and management
- **Cloud Providers**: AWS or GCP for hosting and infrastructure

## Security Best Practices

- Use environment variables for sensitive configuration
- Implement JWT secret rotation for enhanced security
- Enforce HTTPS for all communications
- Set resource limits on containers to prevent abuse

## Performance Optimization

- Optimize Docker images to reduce size and improve startup times
- Set appropriate resource limits to ensure efficient use of resources

## File Structure

```
SUVIDHA/
├── api-gateway/                  # API gateway service
├── client/                       # React + Vite frontend
├── server/                       # Backend services
│   └── services/
│       └── auth/
├── docs/                         # Documentation
│   ├── architecture/
│   ├── database/
│   ├── deployment/
│   │   └── DOCKER-SETUP.md
│   └── scratch/
├── scripts/                      # Root-level utility scripts

│   ├── docker-helper.sh
│   └── docker-helper.bat
```
