# 티켓팅 실전 연습 시뮬레이터 (Ticketing-Warrior)

고가용성과 안정성을 갖춘 클라우드 기반 **티켓팅 실전 연습 시뮬레이터**입니다.  
AWS의 서버리스 및 매니지드 서비스를 적극 활용하여 **대규모 트래픽에도 견딜 수 있는 인프라**를 구축했습니다.

---

## 주요 기능
- 매 분 0초 ~ 15초 사이에만 예매 연습이 가능하도록 제한된 티켓팅 환경 제공
- 좌석 선택 및 예매 기능 제공
- 예매 성공 시, 티켓팅 소요 시간을 기반으로 개인 순위(상위 % 퍼센트) 확인 가능
- 실제 티켓팅 예매 서비스 환경 구축을 위한 내부 봇 구현

---

## 2. 시스템 아키텍처
<img width="2000" height="1750" alt="2" src="https://github.com/user-attachments/assets/af7ce673-2d22-484d-b7ab-796f57ef1ad3" />


### 개요
**AWS ECS Fargate** 기반 서버리스 컨테이너 아키텍처를 구축하였으며,  
정적 콘텐츠는 **CloudFront + S3**로 분리하여 성능을 최적화했습니다.

또한 **Secrets Manager**로 환경 변수를 안전하게 관리하고,  
**CloudWatch**로 전체 시스템을 모니터링하는 **보안·안정성 중심 아키텍처**입니다.

### 트래픽 흐름
1. **사용자 요청** → CloudFront (CDN)
2. **정적 자산 요청**
   - CloudFront 캐시
   - (캐시 MISS 시) → S3(OAC) → 사용자
3. **API 요청**
   - CloudFront → ALB → ECS Fargate Task
4. **백엔드 처리**
   - ECS Task 실행 시 Secrets Manager에서 환경 변수/DB 비밀번호 로드
5. **데이터 처리**
   - 세션/캐시: ElastiCache (Valkey)
   - 트랜잭션 데이터: Aurora RDS (MySQL)
6. **모니터링**
   - 모든 로그·지표는 CloudWatch로 통합 관리

---

## 3. 사용 기술 스택

### Frontend
[![My Skills](https://skillicons.dev/icons?i=react,vite,js)](https://skillicons.dev)

### Backend
[![My Skills](https://skillicons.dev/icons?i=nodejs,express,mysql)](https://skillicons.dev)

### Infra
[![My Skills](https://skillicons.dev/icons?i=aws,redis)](https://skillicons.dev)
<br>
<br>
**AWS Service**
<br>
<img width="40" height="40" alt="Arch_Amazon-VPC-Lattice_32" src="https://github.com/user-attachments/assets/05f2a5fe-b7af-4088-a550-f3fff04a624b" />
<img width="40" height="40" alt="Arch_Amazon-ECS-Anywhere_32" src="https://github.com/user-attachments/assets/5be0a28b-d411-4394-940d-700f106cc0b5" />
<img width="40" height="40" alt="Arch_Amazon-Elastic-Container-Registry_32" src="https://github.com/user-attachments/assets/976cf13d-308c-42af-8340-ec9d436b2cb4" />
<img width="40" height="40" alt="Res_Elastic-Load-Balancing_Application-Load-Balancer_48" src="https://github.com/user-attachments/assets/fcea4ec5-63f7-4e0b-b5ff-528927e7b761" />
<img width="40" height="40" alt="Arch_Amazon-Aurora_32" src="https://github.com/user-attachments/assets/a55ce58c-a911-45ca-93e5-fafa2bdd8321" />
<img width="48" height="48" alt="Res_Amazon-ElastiCache_ElastiCache-for-Valkey_48" src="https://github.com/user-attachments/assets/8a73dde0-1a1d-493d-af3c-16a9b2830d35" />
<img width="40" height="40" alt="Arch_Amazon-CloudFront_32" src="https://github.com/user-attachments/assets/b39a372f-e085-475d-a80d-6708714fddbe" />
<img width="40" height="40" alt="Arch_Amazon-S3-on-Outposts_32" src="https://github.com/user-attachments/assets/2eb9a0d6-84b5-40c7-b6f4-7dde90a5fcff" />
<img width="40" height="40" alt="Arch_AWS-Secrets-Manager_32" src="https://github.com/user-attachments/assets/14fb8f20-2180-4db4-8c8f-ed71be1c7403" />
<img width="40" height="40" alt="Arch_Amazon-CloudWatch_32" src="https://github.com/user-attachments/assets/2409f64f-03e9-4dd7-977b-c8c38d6a7ed0" />
<img width="40" height="40" alt="Arch_Amazon-Simple-Notification-Service_32" src="https://github.com/user-attachments/assets/003bcda5-0667-4d95-9e6d-03bb5e1bc2ac" />


### DevOps
[![My Skills](https://skillicons.dev/icons?i=githubactions,docker)](https://skillicons.dev)

### Test
<img width="40" height="40" alt="image" src="https://github.com/user-attachments/assets/37292bae-f916-46b8-8352-fd2b596df4da" />


---

## 4. AWS 인프라 구성

### VPC (네트워크)
- **Public Subnet (2개)**  
  - ALB, NAT Gateway, Internet Gateway 배치
- **Private Subnet (2개)**  
  - ECS Task, Aurora RDS, ElastiCache 배치

### 컴퓨팅/스케일링
- AWS **ECS Fargate**
- Auto Scaling:  
  - CPU 50% 초과 시 Task 1 → 4로 확장

### 로드밸런싱
- ALB가 모든 API 트래픽을 ECS Tasks로 분산

### 데이터 스토리지
- Aurora RDS MySQL (Multi-AZ)
- ElastiCache (Valkey)로 고속 캐싱 및 세션 관리

---

## 5. 애플리케이션 구조

### 패키지/모듈 구조
- `queue` – 대기열 관련 로직
- `seat` – 좌석 관련 로직
- `bot` – 봇 관련 로직
- `record` – 기록 관련 로직

### 주요 도메인 기능
- 좌석 실시간 예매 트랜잭션 처리
- Redis 기반 예매 락 처리
- 예매 결과 조회

---

## 6. 배포 방법 (CI/CD)

GitHub Actions 기반 자동 CI/CD 파이프라인 구성

1. **커밋 및 푸시 → main 브랜치**
2. GitHub Actions 자동 실행 (테스트 및 코드 검증)
3. Docker 이미지 빌드 → **AWS ECR**로 Push
4. AWS ECS가 새 이미지를 감지하여 자동으로 ECS Service 재배포
5. React Frontend는 별도 workflow로 **S3에 자동 업로드**

---

## 7. 운영/모니터링

### 통합 모니터링
- CloudWatch Dashboard에서 전체 지표 통합 관리

### 로그 관리
- 모든 Node.js 로그 → CloudWatch Logs 전송

### 주요 알람 (CloudWatch Alarm)
- ALB 5XX Error Rate > 5%
- ECS Task CPU > 70%
- Aurora DB Connections 임계치 초과

### 장애 대응 우선순위
1. ALB 5XX 증가
2. ECS Task 로그 확인
3. DB / ElastiCache 연결 상태 점검

---

## 8. 팀원 및 역할

| 이름 | 역할 |
|------|------|
| 강민주(PM) | Infra, Architecture, Backend, CI/CD |
| 곽라흔 | Infra, Monitoring, DB Migration |
| 김다은 | Architecture, Frontend, Design |
| 임지은 | Backend & API Integration Developer, Load Tester |
| 최준형 | Infra, Cloud Security, Documentation Manager |

---

## License
본 프로젝트는 팀 공동 소유입니다.
