# Portfolio App Commands

# Run Next.js dev server on port 3020
dev:
    @echo "Killing any process on port 3020..."
    @fuser -k 3020/tcp 2>/dev/null || true
    @sleep 1
    bun run dev --port 3020

# Build for production
build:
    bun run build

# Run production server
start:
    @fuser -k 3020/tcp 2>/dev/null || true
    @sleep 1
    bun run start -- -p 3020

# Run Prisma studio
db-studio:
    bunx prisma studio

# Push database schema
db-push:
    bunx prisma db push

# Generate Prisma client
db-generate:
    bunx prisma generate
