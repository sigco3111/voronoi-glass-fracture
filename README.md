# 🪟 유리 파편 파괴 (Voronoi Fracture)

> Matter.js 물리 + Voronoi 알고리즘 기반 유리 파괴 시뮬레이션

화면 중앙의 유리판을 마우스로 클릭하면, 충격 지점을 중심으로 보로노이(Voronoi) 알고리즘이 유리 표면을 불규칙한 다각형 조각으로 분할하고, 그 파편들이 중력과 물리 법칙에 따라 바닥으로 떨어지며 서로 충돌하고 튕기는 파괴 시뮬레이션입니다. 슬로 모션 토글로 파괴의 결정적인 한 순간을 천천히 관찰할 수 있습니다.

---

## 🎬 라이브 데모

> **👉 [https://voronoi-glass-fracture.vercel.app/](https://voronoi-glass-fracture.vercel.app/)** — 브라우저에서 바로 실행 (60fps)

| | |
|---|---|
| ![Demo](https://img.shields.io/badge/Live-Demo-7C3AED?style=for-the-badge&logo=vercel&logoColor=white) | [![Repo](https://img.shields.io/badge/GitHub-sigco3111%2Fvoronoi--glass--fracture-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sigco3111/voronoi-glass-fracture) |
| ![Status](https://img.shields.io/badge/Status-Live-22C55E?style=flat-square) | ![Stack](https://img.shields.io/badge/Stack-Vanilla_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |
| ![License](https://img.shields.io/badge/License-MIT-F1C40F?style=flat-square) | ![Deps](https://img.shields.io/badge/Dependencies-Inlined-9CA3AF?style=flat-square) |

### 🎮 빠른 사용법
1. 위 데모 링크 클릭 → 브라우저에서 페이지 열기
2. **유리판 좌클릭** — 충격 지점을 중심으로 Voronoi 셀이 분할되며 파괴 시작
3. **슬로 모션 토글** — 우측 상단 `1×` / `0.25×` / `0.1×` 배속 전환
4. **Reset 버튼** — 새 유리판 즉시 재생성

---

## 🤖 생성 정보

이 프로젝트의 코드는 아래 모델과 프롬프트를 이용해 **자동으로 생성**되었습니다.

| 항목 | 값 |
|---|---|
| **모델** | MiniMax-M3 |
| **실행 환경** | OpenCode CLI |
| **저장소** | [`sigco3111/voronoi-glass-fracture`](https://github.com/sigco3111/voronoi-glass-fracture) |
| **라이선스** | MIT |
| **의존성** | 인라인 (Matter.js, d3-delaunay — 단일 HTML) |

### 📝 사용된 프롬프트 (원문)

```
화면 중앙의 유리판을 마우스로 클릭하면 충격 지점을 중심으로 보로노이(Voronoi) 알고리즘에 기반해 불규칙한 조각으로 산산조각이 나고, 깨진 유리 조각들이 중력과 물리 법칙에 따라 바닥으로 떨어지며 서로 충돌하고 튕기는 파괴 시뮬레이션을 슬로 모션 기능과 함께 만들어줘.
Implementation Advice: Use Matter.js (Physics) combined with a Voronoi library (like d3-delaunay) to generate the polygon shards at the click point. Then convert these shards into Matter.js bodies and activate gravity. 모든 의존관계의 코드를 하나의 HTML에 담는 형태로 코드 작성.
```

---

## ✨ 주요 특징

- 🖱️ **클릭 기반 파괴** — 유리판 어디든 클릭하면 충격 지점을 중심으로 Voronoi 셀이 분할됩니다.
- 🔷 **불규칙 파편** — Poisson-disk 샘플링 + 거리 가중치로 충격점에 더 작은 조각이 모이는 자연스러운 균열 패턴.
- ⚙️ **Matter.js 물리** — 각 폴리곤 파편이 강체(rigid body)로 변환되어 중력·회전·탄성 충돌을 시뮬레이션합니다.
- ⏱️ **슬로 모션** — 우측 상단 토글로 `1×` / `0.25×` / `0.1×` 배속 전환. 파괴의 순간을 천천히 관찰 가능.
- 🔄 **재시작 버튼** — 파괴 후 새 유리판을 즉시 재생성할 수 있습니다.
- 📦 **단일 HTML** — 외부 의존성 0개. 모든 라이브러리가 인라인으로 포함되어 네트워크 없이 동작합니다.

---

## 🚀 실행 방법

### 방법 1: 그냥 브라우저로 열기 (가장 간단)
```bash
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

### 방법 2: 로컬 서버 (권장)
```bash
python3 -m http.server 8000
# → http://localhost:8000
```

### 방법 3: 라이브 데모 (Vercel)
위 라이브 데모 URL을 브라우저로 열면 됩니다.

---

## 🎮 조작법

| 입력 | 효과 |
|---|---|
| **유리판 좌클릭** | 해당 지점을 충격점으로 파괴 시작 |
| **슬로 모션 토글** | `1×` / `0.25×` / `0.1×` 배속 전환 |
| **Reset 버튼** | 새 유리판 즉시 재생성 |
| **화면 하단 카운터** | 현재 파편 수 / 누적 충돌 횟수 표시 |

---

## 🛠️ 기술 스택

| 영역 | 사용 기술 |
|---|---|
| **물리 엔진** | [Matter.js](https://brm.io/matter-js/) — 강체 시뮬레이션 |
| **Voronoi 분할** | [d3-delaunay](https://github.com/d3/d3-delaunay) — Delaunay 삼각분할 + Voronoi 다이어그램 |
| **렌더링** | HTML5 Canvas 2D Context — 파편 다각형 직접 렌더링 |
| **UI** | CSS 변수 기반 다크 테마 + 시스템 sans-serif 폰트 |
| **의존성** | 인라인 (Matter.js + d3-delaunay 모두 단일 HTML에 포함) |

---

## 📂 프로젝트 구조

```
voronoi-glass-fracture/
├── index.html      # 단일 HTML (모든 코드 + 라이브러리 인라인)
├── build.js        # 의존성 결합 빌드 스크립트 (개발용)
├── README.md       # 한국어
└── LICENSE         # MIT
```

---

## 🎨 디자인 결정

브레인스토밍 단계에서 내린 결정 4가지:

| 결정 포인트 | 선택 | 이유 |
|---|---|---|
| **충격점 편향 샘플링** | 거리 반비례 가우시안 노이즈 | 균등 Poisson-disk만 쓰면 균열이 화면 전체에 고르게 퍼져서 인상이 약함. 충격 근처가 더 잘게 부서지는 실제 유리 파괴 패턴 모사 |
| **파편 모양** | Voronoi 셀 다각형 그대로 `Bodies.fromVertices()` | 단순 삼각형/사각형 근사가 아닌 Voronoi 셀이 반환하는 변 다각형 그대로 사용해 시각적 사실성 유지 |
| **파편 색상** | 인덱스 기반 HSL 오프셋 | 같은 유리라도 조각마다 미묘하게 다른 청록/하늘빛 굴절을 띠게 함 |
| **슬로 모션** | `Engine.timing.timeScale` 직접 조작 | CSS transition으로 시각 효과를 흉내내지 않고 물리 엔진의 시간 배율 자체를 조작. 충돌·회전·중력까지 모두 같은 비율로 느려져 물리적 일관성 유지 |

### 직접 커스터마이즈하고 싶다면

`index.html` 상단 `CONFIG` 객체에서 다음 상수를 조정하면 분위기를 바꿀 수 있어요:

```js
const CONFIG = {
  PLATE_W: 600,              // 유리판 너비
  PLATE_H: 400,              // 유리판 높이
  SITE_COUNT: 80,            // Voronoi 사이트 수
  RESTITUTION: 0.35,         // 반발 계수
  FRICTION: 0.4,             // 마찰 계수
  IMPULSE_STRENGTH: 12,      // 충격 시 발산 임펄스 강도
  TIME_SCALES: [1, 0.25, 0.1] // 슬로 모션 옵션
};
```

고급 사용자용: Poisson-disk 샘플링의 거리 가중치 함수(`biasedPoints`)를 교체해 충격점 편향 강도를 조절할 수 있어요.

---

## 📜 License

MIT © 2026 sigco3111

---

## 🙏 Acknowledgments

이 프로젝트는 [MiniMax-M3](https://example.com) 모델과 OpenCode CLI 환경에서 생성되었습니다. 프롬프트 엔지니어링과 디자인 결정은 저장소 소유자가 직접 수행했습니다.

- **코딩미션 참조 페이지**: [cokac.com — 코드깎는노인](https://cokac.com/list/announcement/24)