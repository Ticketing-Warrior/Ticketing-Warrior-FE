# 1️⃣ 베이스 이미지 (대문자 FROM)
FROM node:20-alpine AS builder

# 2️⃣ 작업 디렉터리 설정
WORKDIR /app

# 3️⃣ package.json, package-lock.json 복사 → 의존성 설치
COPY package*.json ./
# (pnpm 사용 시: COPY pnpm-lock.yaml ./
#  npm install (or pnpm install / yarn install)
RUN npm ci   # production‑only 의존성만 설치 

# 4️⃣ 소스 전체 복사
COPY . .

# 5️⃣ 빌드 실행
RUN npm run build   # Vite가 /dist (또는 /build) 폴더에 정적 파일을 만든다

# ------------------------------------------------------------
# 6️⃣ 실제 배포용 이미지 (nginx 로 정적 파일 제공)
# ------------------------------------------------------------
FROM nginx:stable-alpine AS runtime

# nginx 기본 설정 파일을 그대로 사용 (필요 시 커스텀 설정을 복사)
# COPY nginx.conf /etc/nginx/conf.d/default.conf   # (선택)

# 빌드 단계에서 만든 정적 파일을 nginx html 폴더에 복사
COPY --from=builder /app/dist/. /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html

# (선택) 캐시 무효화를 위해 헤더 설정
# RUN echo "add_header Cache-Control \"public, max-age=0, must-revalidate\";" >> /etc/nginx/conf.d/default.conf

# 컨테이너 실행 포트 (nginx 기본 80)
EXPOSE 80

# 기본 명령
CMD ["nginx", "-g", "daemon off;"]