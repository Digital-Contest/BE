FROM node:18.6.0
# 작업 디렉토리 지정
WORKDIR /app
# npm install 을 위해서 dependency 와 환경변수 추가
COPY package.json ./
COPY .env ./

RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon-x11-0 \
    libdrm2 \
    libgbm1 \
    libasound2 \
    libxrandr2 \
    libxcomposite1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libpango1.0-0 \
    libcairo2 \
    libx11-xcb1 \
    libxfixes3 \
    libxrender1 \
    libfontconfig1 \
    libglib2.0-0 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget

    
# 모듈 설치
RUN npm install --force
RUN npm install pm2 -g

# 나머지 코드들 작업 디렉토리에 복사
COPY ./ ./



ENV CHOKIDAR_USEPOLLING=true
# 컨테이너가 올라가면 서버 기동
CMD ["npm", "start"]