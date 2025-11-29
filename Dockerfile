# 베이스 이미지
FROM node:20-alpine AS builder

# 작업 디렉터리 설정
WORKDIR /app

# package.json / package-lock.json 복사 → 전체 의존성 설치 (dev 포함)
COPY package*.json ./
# (pnpm 사용 시: COPY pnpm-lock.yaml ./)
RUN npm ci   # 전체 의존성 설치 (dev‑dependency 포함)

# 소스 전체 복사 (node_modules 는 .dockerignore 로 제외됨)
COPY . .

# Vite 빌드 실행 → /app/dist 폴더에 정적 파일 생성
RUN npm run build  
