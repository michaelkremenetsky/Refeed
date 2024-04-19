FROM --platform=linux/amd64 node:20-alpine AS builder

	RUN apk add --no-cache libc6-compat openssl && apk update
	WORKDIR /app
	RUN yarn global add turbo
	COPY . . 
	RUN turbo prune --scope=@refeed/nextjs --docker

FROM --platform=linux/amd64 node:20-alpine AS installer

  # Temp Removed
	# ARG OPENAI_API_KEY
	# ENV OPENAI_API_KEY=$OPENAI_API_KEY

	ARG NEXT_PUBLIC_SUPABASE_URL
	ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
	ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

	ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
	ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
	ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}

	RUN apk add --no-cache libc6-compat openssl && apk update
	WORKDIR /app

	ENV NODE_ENV production
	ENV CI         true

	COPY .gitignore .gitignore 
	COPY --from=builder /app/out/json .
	COPY --from=builder /app/out/pnpm-lock.yaml\* ./

	RUN yarn global add pnpm@8.15.7 && pnpm fetch --prod && pnpm install -r --offline --prod

	COPY --from=builder /app/out/full .

	RUN SKIP_ENV_VALIDATION=1 pnpm turbo build --filter=nextjs...


FROM --platform=linux/amd64 node:20-alpine AS runner

	RUN apk add --no-cache libc6-compat openssl && apk update
	WORKDIR /app

	RUN addgroup --system --gid 1001 nodejs
	RUN adduser --system --uid 1001 nextjs
	USER nextjs
	EXPOSE 3000
	ENV PORT 3000

	ENV NODE_ENV production

	ENV NEXT_TELEMETRY_DISABLED 1

	COPY --from=installer /app/apps/web/next.config.mjs ./
	COPY --from=installer /app/apps/web/package.json ./

	COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
	COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
	COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

	ENV HOSTNAME "0.0.0.0"

	CMD node apps/web/server.js
