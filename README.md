# 김근우 · Keunwoo Kim — SK AIGEN 1기 지원 포트폴리오

한 페이지 포트폴리오입니다. 두 프로젝트를 같은 5단계(배경 → 과정 → 결과 → 한계 → AIGEN과 함께할 발전 방향)로 보여 줍니다.

- **Project 01 · 오프더볼을 데이터로**: 석사 논문, Tracking-enhanced VAEP ([코드](https://github.com/df-optimister/Tracking-enhanced-VAEP))
- **Project 02 · 종이 쿠폰을 앱으로**: BONBAB 적립 앱 ([코드](https://github.com/df-optimister/bonbab-app))

사이트: https://df-optimister.github.io/aigen-portfolio/

## 실행

정적 사이트라 `index.html`을 열면 됩니다. 영상 데모와 좌표 데이터까지 보려면 로컬 서버로 여세요.

```bash
npm install
npm run serve      # http://localhost:4173
npm test           # 단위 테스트(jsdom) + E2E(Playwright, 설치된 Chrome 사용)
npm run pdf        # dist/portfolio.pdf
```

## 출처

Project 01의 영상 데모는 공개 데이터로 만든 개념 시연이며, 논문의 범위에 포함되지 않습니다.

> Video & tracking data: SoccerTrack v2 (Scott, Uchida, Kuroda, Kim, Fujii, 2025, arXiv:2508.01802), CC BY 4.0 — https://atomscott.github.io/SoccerTrack-v2/

원본 영상(4096×1080 파노라마)에서 14초 구간을 골라 1280×720 크기로 잘라냈습니다. 선수 박스 주석은 피치 좌표(m)로 변환해 함께 표시했습니다.

이 페이지는 SK 또는 AIGEN의 공식 페이지가 아닙니다.
