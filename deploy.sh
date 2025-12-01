# 안정적인 배포를 위해 스크립트 파일을 사용

#!/bin/bash

# 설정값 
# 브라우저 -> cloudfront(프록시) -> alb 
export VITE_SERVER_API_URL="https://dxg6pejazganb.cloudfront.net" 
S3_BUCKET_NAME="tw-s3-bucket-796973515852-ap-northeast-2 "
CLOUDFRONT_DISTRIBUTION_ID="E3UC9ED73VNRBG"

# 1. 의존성 설치
npm install

# 2. 프로젝트 빌드
echo "🚀 Building project..."
npm run build

# 빌드 성공 여부 확인
if [ $? -ne 0 ]; then
  echo "Build failed. Aborting deployment."
  exit 1
fi

# 3. S3로 파일 업로드 (Sync)
# --delete 옵션 : 로컬에 없는 파일이 버킷에 있으면 삭제하여 동기화
echo "Uploading to S3 ($S3_BUCKET_NAME)..."
aws s3 sync ./dist s3://$S3_BUCKET_NAME --delete

# 업로드 성공 여부 확인
if [ $? -ne 0 ]; then
  echo "S3 upload failed. Aborting deployment."
  exit 1
fi

# 4. CloudFront 캐시 무효화
echo "Invalidating CloudFront cache ($CLOUDFRONT_DISTRIBUTION_ID)..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

# 무효화 요청 성공 여부 확인
if [ $? -ne 0 ]; then
  echo "CloudFront invalidation failed."
  exit 1
fi

echo "✅ Deployment complete."
