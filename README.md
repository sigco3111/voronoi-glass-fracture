# 🪟 유리 파편 파괴 (Voronoi Fracture)

화면 중앙의 유리판을 마우스로 클릭하면, 충격 지점을 중심으로 보로노이(Voronoi) 알고리즘이 유리 표면을 불규칙한 다각형 조각으로 분할하고, 그 파편들이 중력과 물리 법칙에 따라 바닥으로 떨어지며 서로 충돌하고 튕기는 파괴 시뮬레이션입니다. 슬로 모션 토글로 파괴의 결정적인 한 순간을 천천히 관찰할 수 있습니다.

## 🤖 생성 정보 (Attribution)

이 저장소의 코드는 [OpenCode](https://github.com/sst/opencode) CLI와 **MiniMax M3** 모델을 사용해 생성되었습니다.

| 항목 | 값 |
| --- | --- |
| 코드 생성 도구 | OpenCode CLI |
| 사용 모델 | MiniMax M3 (`minimax/MiniMax-M3`) |
| NVIDIA NIM 폴백 | `nvidia/openai/gpt-oss-120b` |
| 생성 일자 | 2026-07-08 |

## ✨ 주요 특징 (Features)

- **클릭 기반 파괴** — 유리판 어디든 클릭하면 충격 지점을 중심으로 Voronoi 셀이 분할됩니다.
- **불규칙 파편** — Poisson-disk 샘플링 + 거리 가중치로 충격점에 더 작은 조각이 모이는 자연스러운 균열 패턴.
- **Matter.js 물리** — 각 폴리곤 파편이 강체(rigid body)로 변환되어 중력·회전·탄성 충돌을 시뮬레이션합니다.
- **슬로 모션** — 우측 상단 토글로 `1×` / `0.25×` / `0.1×` 배속 전환. 파괴의 순간을 천천히 관찰 가능.
- **재시작 버튼** — 파괴 후 새 유리판을 즉시 재생성할 수 있습니다.
- **의존성 인라인** — Matter.js, d3-delaunay 등 모든 라이브러리를 단일 HTML에 포함, 네트워크 없이 동작.

## 🚀 실행 방법 (Quick Start)

저장소를 클론한 뒤, `index.html`을 브라우저로 열면 바로 실행됩니다.

```bash
git clone https://github.com/sigco3111/voronoi-glass-fracture.git
cd voronoi-glass-fracture
open index.html      # macOS
# xdg-open index.html    # Linux
# start index.html       # Windows
```

빌드 도구, 패키지 매니저, 의존성 설치가 필요 없는 단일 HTML 프로젝트입니다.

## 🎮 조작법 (Controls)

| 입력 | 동작 |
| --- | --- |
| 유리판 좌클릭 | 해당 지점을 충격점으로 파괴 시작 |
| 슬로 모션 토글 | `1×` / `0.25×` / `0.1×` 배속 전환 |
| Reset 버튼 | 새 유리판 즉시 재생성 |
| 화면 하단 카운터 | 현재 파편 수 / 누적 충돌 횟수 표시 |

## 🛠️ 기술 스택 (Tech Stack)

| 분류 | 사용 기술 |
| --- | --- |
| 물리 엔진 | [Matter.js](https://brm.io/matter-js/) — 강체 시뮬레이션 |
| Voronoi 분할 | [d3-delaunay](https://github.com/d3/d3-delaunay) — Delaunay 삼각분할 + Voronoi 다이어그램 |
| 그래픽 | HTML5 Canvas 2D Context — 파편 다각형 직접 렌더링 |
| 폰트 / UI | 시스템 sans-serif + CSS 변수 기반 다크 테마 |
| 빌드 | 없음 (단일 HTML, 모든 의존성 인라인) |

## 🎨 디자인 결정 (Design Choices)

- **충격점 편향 샘플링** — 균등 Poisson-disk만 쓰면 균열이 화면 전체에 고르게 퍼져서 인상이 약해집니다. 충격점에서 가까운 사이트일수록 최소 반경을 줄이고 더 조밀하게 샘플링해, 중앙이 더 잘게 부서지는 실제 유리 파괴 패턴을 모사했습니다.
- **파편 모양 = Voronoi 셀 다각형 그대로** — 단순 삼각형/사각형으로 근사하지 않고 Voronoi 셀이 반환하는 변 다각형을 Matter.js `Bodies.fromVertices()`에 그대로 넣어 시각적 사실성을 유지했습니다.
- **glassRefraction 색상** — 각 파편에 인덱스 기반 HSL 오프셋을 적용해, 같은 유리라도 조각마다 미묘하게 다른 청록/하늘빛 굴절을 띠게 했습니다.
- **슬로 모션 = `Engine.timing.timeScale`** — 시각 효과(예: CSS transition)로 슬로 모션을 흉내내지 않고 물리 엔진의 시간 배율 자체를 조작합니다. 충돌·회전·중력까지 모두 같은 비율로 느려지므로 물리적 일관성이 유지됩니다.

## 🧠 동작 원리 (How It Works)

1. **초기화** — 유리판 영역(`plate`)을 정의하고 Poisson-disk 샘플링으로 N개의 Voronoi 사이트를 균일 분포시킵니다.
2. **클릭 이벤트** — 사용자의 클릭 좌표 `(cx, cy)`를 충격점으로 등록합니다. 기존 사이트 좌표에 충격점으로부터의 거리에 반비례하는 가우시안 노이즈를 더해, 충격 근처 사이트가 더 조밀·불규칙하게 모이게 합니다.
3. **Voronoi 분할** — `Delaunay.from(points).voronoi([xmin, ymin, xmax, ymax])`로 부동 소수점 다이어그램을 계산하고, 각 셀의 다각형 정점을 추출합니다.
4. **강체 변환** — 각 Voronoi 셀을 `Matter.Bodies.fromVertices(centroid, [points], options)`에 넣어 강체로 변환합니다. 옵션에 `restitution: 0.35, friction: 0.4`를 설정해 유리 특유의 약한 반발과 마찰을 흉내냅니다.
5. **중력 활성화** — 분할 직전까지 `isStatic: true`로 고정해 두었던 유리판 파편들을 `Body.setStatic(body, false)`로 동시에 해제해 폭발적인 낙하를 유발합니다. 초기 속도에는 충격점에서 바깥으로 발산하는 방사형 임펄스를 부여합니다.
6. **렌더링 루프** — `Runner.run(engine)` + 매 프레임 `Render.world(engine)`로 모든 강체를 폴리곤 단위로 직접 그립니다.

## 🔬 검증 (Verification)

- **로컬 검증** — `index.html`을 더블클릭/드래그로 브라우저에서 열면 추가 빌드 없이 즉시 시뮬레이션이 시작됩니다.
- **네트워크 차단 테스트** — DevTools의 Network 탭에서 `Offline`으로 전환한 뒤 새로고침해도 정상 작동해야 합니다(모든 의존성 인라인 확인용).
- **물리 정합성** — 파편들이 서로 겹치지 않고(NaN/Infinity 방지), 바닥에서 안정적으로 정지하는지 확인합니다.
- **슬로 모션 검증** — `0.1×` 전환 후 5초 이상 관찰 시 파편 낙하·회전이 시각적으로 약 10분의 1 속도로 동작해야 합니다.