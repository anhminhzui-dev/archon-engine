# ARCHON-ENGINE
### Autonomous Agent Transactional 3D Scene Graph Synthesizer

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
[![Tests: 100% Passed](https://img.shields.io/badge/Tests-11%2F11%20Passed-success)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen)](#)

> **A headless, deterministic 3D procedural execution engine designed specifically for Large Language Model (LLM) and Vision agents to direct, mutate, and verify VFX scenes via atomic JSON-RPC transactions.**

---

## 1. The Architectural Thesis: Beyond 2D Diffusion Slop

The majority of contemporary "AI for 3D" attempts rely on 2D image/video diffusion models or unstructured Gaussian splats. In professional film, VFX, and game production, **these approaches fail completely**:
* **Zero Relighting or Shading Control:** You cannot isolate a key light, change roughness, or adjust metallic reflections.
* **Non-Deterministic Hallucination:** A model hallucinating pixels across frames cannot produce an editable 3D asset that a technical director can rig or composite.
* **No Version Control or Atomic Rollback:** If an agent makes a mistake, the entire asset is ruined.

`ARCHON-ENGINE` treats 3D scene creation like **software transaction processing**. Agents do not draw pixels; they dispatch typed, schema-validated JSON-RPC mutations against a hierarchical scene graph with full cryptographic rollback guarantees.

```
ARCHON AGENTIC TRANSACTION LOOP
┌───────────────────────────┐
│ Autonomous LLM / Vision   │ ──► Receives brief: "Adjust portal framing & energy hue"
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ JSON-RPC Batch Dispatch   │ ──► [MUTATE_TRANSFORM, SET_MATERIAL, SET_EMITTER]
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ Archon Headless Kernel    │ ──► Schema validation & atomic candidate staging
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ Cryptographic State Pin   │ ──► Computes revision checksum (e.g. rev 4, #a5f3fc)
└─────────────┬─────────────┘
              ▼
┌───────────────────────────┐
│ Atomic Commit or Rollback │ ──► Instant Undo if vision verification fails
└───────────────────────────┘
```

---

## 2. JSON-RPC Mutation Protocol

Every scene alteration evaluates inside an atomic transaction:

```json
[
  {
    "op": "CREATE_NODE",
    "id": "plasma_emitter_ring",
    "type": "TorusKnot",
    "transform": {
      "position": [0.0, 2.5, -4.0],
      "rotation": [0.0, 0.785, 0.0],
      "scale": [1.5, 1.5, 1.5]
    },
    "materialId": "mat_cyan_plasma"
  },
  {
    "op": "SET_MATERIAL",
    "id": "mat_cyan_plasma",
    "color": "#06b6d4",
    "roughness": 0.1,
    "metalness": 0.95
  }
]
```

### Supported Transaction Operations:
* `CREATE_NODE`: Instantiates procedural meshes, groups, or lights with deterministic IDs.
* `MUTATE_TRANSFORM`: Precise Euler/quaternion rotations, translations, and scale vectors.
* `SET_MATERIAL`: Physically Based Rendering (PBR) parameters (roughness, metalness, albedo, procedural noise seeds).
* `SET_EMITTER`: Particle count, emission rates, lifetimes, and velocity fields.
* `DELETE_NODE`: Cleans up scene entities while preserving graph integrity.

---

## 3. Automated Verification Suite

Run the headless verification suite to assert atomic commits and error-resilient rollbacks:

```bash
node test-agent-rpc.js
```

```
=================================================
=== ARCHON-ENGINE TRANSACTIONAL PROOF SUITE ===
=================================================
[PASS] (1/1) Initial empty scene graph created at revision 0
[PASS] (2/2) Batch transaction successfully committed
[PASS] (3/3) Revision advanced to 1
[PASS] (4/4) Node 'portal_emitter_ring' exists in scene graph
[PASS] (5/5) Material properties verified
[PASS] (6/6) Revision advanced to 2
[PASS] (7/7) Transform mutation verified
[PASS] (8/8) Rollback executed safely
[PASS] (9/9) Scale reverted to 2 after rollback
[PASS] (10/10) Invalid node mutation rejected with strict exception
[PASS] (11/11) Scene graph remains uncorrupted after failed transaction
=================================================
VERDICT: 100% of transactional proofs passed (11/11).
=================================================
```

---

## 4. Direct Command-Line Execution

Run the live agent synthesis engine directly from your terminal:

```bash
node archon-core.js
```

### Sample Output:
```
=================================================================
=== ARCHON-ENGINE: AGENT TRANSACTIONAL 3D SCENE SYNTHESIZER ===
=================================================================

[INIT] Initialized root scene graph at revision 0 (checksum: 7ea8f290)
[COMMIT] Transaction committed: revision 1 (checksum: 5bff034f)
[NODES] Total active scene nodes: 3

--- TRANSACTIONAL 3D SCENE GRAPH HIERARCHY TREE ---

  root (Group, id: root) [rev 0]
  └── celestial_portal (Group, id: celestial_portal, pos: [0, 2.5, 0]) [rev 1]
      └── inner_singularity (Mesh: Sphere, mat: mat_portal_core) [rev 1]
  [Emitters]: portal_sparks (5000 particles, rate: 450/s) [rev 1]

---------------------------------------------------

Testing atomic transactional rollback...
[ROLLBACK] Reverted to revision 0 (checksum: 7ea8f290)
[VERIFY] Node count after rollback: 1 (pristine root state)

=================================================================
VERDICT: 100% atomic JSON-RPC 3D scene transactions verified.
=================================================================
```

---

## 5. Proprietary Disclosure & Architecture Fence
In accordance with our open-source release policy:
* **Included:** Core headless scene-graph engine, JSON-RPC transaction dispatcher, revision history stack, and visual reviewer.
* **Withheld:** Internal LLM orchestration prompts, cloud API communication bridges, and studio render farm hooks.

---

## 6. License
Distributed under the MIT License. See `LICENSE` for more information.
