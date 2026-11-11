/* Single source of every word on the page.
 * Project step copy is taken verbatim from the plan document §4 (fact-checked draft).
 * Do not add facts here that are not in the plan document. */
(function (root) {
  var C = {
    meta: {
      label: 'SK AIGEN 1기 지원 포트폴리오',
      nameKo: '김근우',
      nameEn: 'Keunwoo Kim',
      // one tagline per 지망 (shown when that 지망 is selected in the hero)
      taglines: {
        p01: '“공이 없는 순간까지, 공격과 수비의 움직임을 데이터로 읽습니다”',
        p02: '“당연했던 불편을 직접 바꿔, 작은 양조장과 손님을 잇습니다”',
      },
      choiceNote: 'SK AIGEN의 지망 선택에 맞춰 지망별로 프로젝트를 하나씩 제안합니다. 입과 후에는 선택한 하나를 진행합니다.',
    },

    tracks: [
      { label: '1지망 문화/예술/스포츠', project: 'p01', plan: '1안' },
      { label: '2지망 창업/비즈니스', project: 'p02', plan: '2안' },
    ],

    projects: [
      {
        id: 'p01',
        no: '01',
        title: '오프더볼을 데이터로',
        subtitle: '석사 논문 · Tracking-enhanced VAEP · 1지망 문화/예술/스포츠',
        track: '1지망 문화/예술/스포츠',
        steps: [
          {
            no: '01', name: '도전의 배경', viz: 'p01-pitch', plan: false,
            keywords: ['VAEP', '이벤트 데이터 한계', '공 없을 때 움직임', '선행연구 부재'],
            impact: '기존 지표는 공을 가진 순간만 봤다',
            bullets: [
              '기존 VAEP는 이벤트 데이터만으로 행동 가치를 계산',
              '공을 갖지 않은 선수의 위치·움직임은 평가 밖',
              'VAEP 자체가 생소한 지표, 선행연구도 희소',
              '추적 데이터를 결합한 선례는 거의 없음',
            ],
          },
          {
            no: '02', name: '도전 과정과 부여한 가치', viz: 'p01-pipeline', plan: false,
            keywords: ['StatsBomb 360', '공간 맥락', '독학', '지도교수 피드백'],
            impact: '보이지 않던 움직임에 공간 맥락을 더하다',
            bullets: [
              'StatsBomb 360 추적 데이터로 공간 맥락 추가',
              '선수 평가에 오프더볼 맥락을 결합하는 시도',
              '참고할 선례가 거의 없어 개념부터 독학',
              '지도교수와 지속적 피드백으로 설계 보완',
            ],
          },
          {
            no: '03', name: '실행과 결과', viz: 'p01-results', plan: false,
            keywords: ['재현 파이프라인', 'CatBoost', 'AUC 0.847', '2022 월드컵'],
            impact: '수비라인·움직임을 변수화해 모델을 검증하다',
            bullets: [
              '이벤트+360 데이터 통합, 경기 단위 무결성 검증 파이프라인 구축',
              '수비라인 위치·오프더볼 움직임을 공간 변수로 설계',
              'CatBoost·XGBoost·로지스틱회귀를 GroupKFold로 비교, 로그손실 기준 CatBoost 선정',
              '미공개 토너먼트 검증 AUC 0.847(득점)·0.812(실점)',
              '오프더볼 변수 유무 비교(ablation), 소폭 성능 개선 확인',
              '2022 월드컵 선수·팀 가치 산출, 슈팅보다 전진 플레이로 가치를 만든 선수 발견',
              '논문 평가 최우수(76점, First Class)',
            ],
          },
          {
            no: '04', name: '한계와 돌아보기', viz: 'p01-snapshot', plan: false,
            keywords: ['스냅샷 데이터', '정의·측정의 한계', '유의성 미검증', '상용화와 거리'],
            impact: '가능성은 확인했지만 완성과는 거리가 멀었다',
            bullets: [
              '360 데이터는 카메라에 보이는 선수만, 이벤트 순간만 찍은 스냅샷',
              '선수들의 연속적인 움직임 자체는 담지 못함',
              '데이터 수집과 오프더볼 움직임의 정의·측정에 부족한 점 다수',
              '성능 차이에 통계적 유의성 검증은 하지 않음',
              '상용 서비스 수준과는 거리가 멀었지만 가능성은 확인',
            ],
          },
          {
            no: '05', name: 'AIGEN과 함께할 발전 방향', viz: 'p01-roadmap', plan: true,
            keywords: ['영상 기반 자동 추적', '현장 전문가', '동료 협업', '사업화'],
            impact: '논문이 남긴 한계를, AIGEN의 자원으로 하나씩 메우다',
            bullets: [
              'AI 영상 분석(객체 탐지·다중 객체 추적·카메라 보정)으로 위치 데이터를 자동 생성 → 수집의 한계 보완',
              '현장 지도자·스카우트와 공격(침투·공간 창출)과 수비(수비 커버·공격수 방향 제한)의 움직임 유형을 정의하고 모델이 자동 분류 → 정의·측정의 한계 보완',
              '공격의 움직임만 평가하면 절반만 평가하는 것 — 공격과 수비의 오프더볼을 모두 평가에 반영',
              '동료와의 교류·협업으로 서로 다른 배경의 관점을 결합',
              '지표 계산부터 선수 평가·스카우팅 리포트까지 자동화하고 고객을 검증 → 상용화의 한계 보완',
            ],
          },
          {
            no: '06', name: '이 프로젝트에서 탄생한 서비스', viz: 'p01-service', plan: true,
            keywords: ['오프더볼 분석 SaaS', '공격·수비 평가', '스카우팅 리포트', '고객 검증'],
            impact: '공격과 수비의 오프더볼까지 평가하는 축구 분석 SaaS',
            bullets: [
              '논문은 출발점 — 공 없을 때의 움직임을 데이터로 기록해 선수 평가에 반영한다는 아이디어',
              '아래의 분석 서비스를 클라우드에서 제공하는 SaaS 사업',
              '경기 영상에서 선수 위치를 자동으로 추출해 움직임 데이터로 변환',
              '공격(침투·공간 창출)과 수비(수비 커버·공격수 방향 제한)의 오프더볼을 모두 평가',
              '평가 지표 개발, 예측, 선수 평가, 시장 가치 산정, 스카우팅에 실제로 쓰이는 리포트로 제공',
              '이 결과물에 돈을 낼 고객이 누구인지 VALUE CREATION 모듈에서 검증',
            ],
          },
        ],
      },
      {
        id: 'p02',
        no: '02',
        title: '종이 쿠폰을 앱으로',
        subtitle: 'BONBAB 적립 앱 · 2지망 창업/비즈니스',
        track: '2지망 창업/비즈니스',
        steps: [
          {
            no: '01', name: '도전의 배경', viz: 'p02-loop', plan: false,
            keywords: ['종이 적립 쿠폰', '분실/망각', '낮은 재방문 효과', '인쇄 비용'],
            impact: '런던 한식당 BONBAB, 홀 아르바이트에서 발견한 문제',
            bullets: [
              '홀 아르바이트로 근무 중 문제의식 포착',
              '손님들이 종이 쿠폰을 자주 분실·망각',
              '그때마다 새 쿠폰 수령 또는 아예 포기',
              '보상 수령률·재방문 효과 모두 낮고 인쇄 비용 반복 발생',
            ],
          },
          {
            no: '02', name: '도전 과정과 부여한 가치', viz: 'p02-proposal', plan: false,
            keywords: ['자발적 제안', '긍정적 반응', '확장 가능성', '소상공인 서비스'],
            impact: '내가 먼저 사장님께 디지털 적립 앱을 제안',
            bullets: [
              '업무 지시 없이 직접 디지털 적립 앱 제안',
              '단순 적립을 넘어 선결제·공지·피드백 가능성 함께 제시',
              '사장님의 긍정적 반응으로 개발 착수',
              '소규모 자영업자에게 필요한 서비스를 직접 개발·판매해보는 시도로 설정',
            ],
          },
          {
            no: '03', name: '실행과 결과', viz: 'p02-build', plan: false,
            keywords: ['단독 개발', '보안 점검 14건', 'GDPR 설계', '첫 SQL 프로젝트'],
            impact: '요구사항부터 테스트까지 혼자 구현',
            bullets: [
              '요구사항 정의, 설계, 개발, 기기 테스트까지 단독 수행',
              '보안 점검에서 확인된 14건 전부 수정 (적립 시 스캔값 일치 요구, 동시요청 잠금, 비밀번호·이메일 변경 및 탈퇴 전 재인증 등)',
              '테스트용 계정으로 각 공격 시나리오를 실제 API에 직접 재현해 수정 검증',
              'GDPR 기준으로 민족 정보 등 민감정보 수집 배제, 2단계 탈퇴, 분석 동의 기본값 거부로 설계',
              'SQL·관계형 데이터베이스를 처음 다룬 프로젝트',
            ],
          },
          {
            no: '04', name: '한계와 돌아보기', viz: 'p02-timeline', plan: false,
            keywords: ['계약 불발', '출시 전 단계', '완전한 위조 방지 아님', '개발≠판매'],
            impact: '좋은 제품도 채택·판매로 이어지려면 다른 노력이 필요하다는 것을 배움',
            bullets: [
              '개발 완료 후 가격·계약 논의 단계에서 사장님 마음이 바뀌어 계약 불발, 2026년 8월 종료',
              '앱스토어 출시는 시작 전 단계였음',
              '스캔 검증은 완전한 위조 방지가 아니며, 서버 발급 회전 코드는 향후 과제로 남김',
              '제품을 만드는 것과 그것이 채택되고 팔리는 것은 다른 문제임을 깨달음',
            ],
          },
          {
            no: '05', name: 'AIGEN과 함께할 발전 방향', viz: 'p02-flywheel', plan: true,
            keywords: ['전통주 거래 플랫폼', '블루오션', '커뮤니티·마케팅', '현장 전문가'],
            impact: 'BONBAB 경험을 발판 삼아 틈새 시장 거래 플랫폼으로',
            bullets: [
              '소규모 자영업자에게 필요한 서비스를 직접 개발·판매를 시도한 BONBAB 경험을 다음 도전의 발판으로 설정',
              '블루오션으로 전통주 거래 플랫폼을 구상',
              '과제: 사용자를 끌어들이는 기능, 커뮤니티, 마케팅을 어떻게 구현할지',
              'AIGEN 현장 전문가 멘토의 조언으로 전통주 업계 현장 지식의 공백을 메우고 싶음',
              '동료들과의 교류·협업으로 혼자서는 메우기 어려운 기획·실행의 공백을 보완하고 싶음',
              'AI를 활용해 플랫폼 운영과 사용자 참여 유도 방법을 찾고 싶음',
            ],
          },
          {
            no: '06', name: '이 프로젝트에서 탄생한 서비스', viz: 'p02-service', plan: true,
            keywords: ['양조장 직거래', 'AI 리뷰 요약', '취향 매칭', '맛으로 승부'],
            impact: '소규모 양조장과 고객을 바로 잇고, AI 리뷰 요약으로 취향에 맞는 전통주를 찾아 주는 플랫폼',
            bullets: [
              'BONBAB은 출발점 — 소규모 자영업자에게 필요한 서비스를 직접 개발·판매해 본 시도',
              '소규모 양조장을 고객에게 바로 이어 주는 전통주 직거래 플랫폼',
              '생생하고 쉬운 리뷰를 모으고, AI가 전체 리뷰 반응과 평가를 요약 — 고객이 리뷰를 일일이 확인하지 않아도 되는 편리함',
              'AI가 리뷰·평가에서 추출한 제품 특성과 맛 특징으로 고객의 취향·니즈와 매칭',
              '소규모 양조장에게는 브랜드가 아니라 맛으로 승부할 수 있는 장',
              '고객에게는 여러 유통 단계를 거치지 않아 저렴하고, 자기 취향에 딱 맞는 전통주를 찾을 기회',
            ],
          },
        ],
      },
    ],

    next: {
      // gap ↔ resource pairs taken from the two step-05 bullet lists
      matrix: [
        { project: 'p01', gap: '위치 데이터 수집의 한계', resource: 'AI' },
        { project: 'p01', gap: '움직임 정의·측정의 한계', resource: '현장 전문가 멘토' },
        { project: 'p01', gap: '다른 관점을 통한 보완 및 발전', resource: '동료 교류·협업' },
        { project: 'p01', gap: '상용화의 한계', resource: 'AI' },
        { project: 'p02', gap: '전통주 업계 현장 지식의 공백', resource: '현장 전문가 멘토' },
        { project: 'p02', gap: '혼자서는 메우기 어려운 기획·실행의 공백', resource: '동료 교류·협업' },
        { project: 'p02', gap: '플랫폼 운영과 사용자 참여 유도', resource: 'AI' },
      ],
      roadmap: [
        { phase: 'YEAR 1 · FIELD', items: [
          { project: 'p01', text: '영상을 움직임 데이터로 바꾸는 시제품, 동료·현장 전문가와 움직임 정의 맞추기' },
        ] },
        { phase: 'YEAR 1 · VALUE CREATION', items: [
          { project: 'p01', text: '고객 문제와 MVP 검증' },
          { project: 'p02', text: '전통주 거래 플랫폼의 고객 문제 확인·MVP' },
        ] },
        { phase: 'YEAR 2', items: [
          { project: 'p01', text: '실제 사례에 적용' },
          { project: 'p02', text: '창업 검증' },
        ] },
        { phase: 'Demo Day', items: [
          { project: 'all', text: '결과 발표' },
        ] },
      ],
    },

    demo: {
      label: '공개 데이터로 만든 개념 시연 · 논문 범위 아님',
      attribution: 'Video & tracking data: SoccerTrack v2 (Scott, Uchida, Kuroda, Kim, Fujii, 2025, arXiv:2508.01802), CC BY 4.0',
      datasetUrl: 'https://atomscott.github.io/SoccerTrack-v2/',
    },

    links: {
      linkedin: 'https://linkedin.com/in/keunwoo-kim-78138820b',
      github: 'https://github.com/df-optimister',
      repoThesis: 'https://github.com/df-optimister/Tracking-enhanced-VAEP',
      repoBonbab: 'https://github.com/df-optimister/bonbab-app',
    },
  };

  if (typeof module === 'object' && module.exports) module.exports = C;
  else root.PORTFOLIO_CONTENT = C;
})(typeof window !== 'undefined' ? window : this);
