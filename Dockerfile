# 1. Build Stage
FROM node:20-slim as builder

# 작업 디렉토리(Working Directory): 컨테이너 내부의 /app 폴더를 작업 공간으로 정의
WORKDIR /app

# 의존성 복사 방식: 프로젝트 메타 정보(package.json)를 먼저 복사 후, 의존성 설치
COPY package.json package-lock.json ./
RUN npm install


#  빌드 명령어 실행 -> /app/dist 폴더 생성
RUN npm run build 


# 최종 이미지가 아닌, CI/CD 파이프라인에서 이 'builder' 스테이지로 접근하여
# /app/dist 폴더의 내용을 S3로 복사.