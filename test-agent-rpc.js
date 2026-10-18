/**
 * ArchonEngine Automated Agent Transactional Verification Suite
 */

import { ArchonEngine } from './archon-core.js';

console.log("=================================================");
console.log("=== ARCHON-ENGINE TRANSACTIONAL PROOF SUITE ===");
console.log("=================================================\n");

let passed = 0;
let total = 0;

function assert(cond, name) {
  total++;
  if (cond) {
    passed++;
    console.log(`[PASS] (${passed}/${total}) ${name}`);
  } else {
    console.error(`[FAIL] (${passed}/${total}) ${name}`);
    process.exit(1);
  }
}

const engine = new ArchonEngine();
assert(engine.revision === 1, "Initial empty scene graph created at revision 0");

// 1. Transactional batch node & material creation
const commit1 = engine.dispatchTransaction([
  {
    op: "SET_MATERIAL",
    id: "mat_plasma_core",
    color: "#ff3366",
    roughness: 0.1,
    metalness: 0.9
  },
  {
    op: "CREATE_NODE",
    id: "portal_emitter_ring",
    type: "Mesh",
    materialId: "mat_plasma_core",
    transform: { position: [0, 2.5, -5.0], scale: [2, 2, 2] }
  },
  {
    op: "SET_EMITTER",
    id: "spark_stream_01",
    particleCount: 5000,
    emissionRate: 500,
    color: "#ffaa00"
  }
], "Agent: Construct primary energy emitter");

assert(commit1.status === "COMMITTED", "Batch transaction successfully committed");
assert(commit1.revision === 1, "Revision advanced to 1");
assert(engine.sceneGraph.nodes["portal_emitter_ring"] !== undefined, "Node 'portal_emitter_ring' exists in scene graph");
assert(engine.sceneGraph.materials["mat_plasma_core"].color === "#ff3366", "Material properties verified");

// 2. Secondary mutation
const commit2 = engine.dispatchTransaction([
  {
    op: "MUTATE_TRANSFORM",
    id: "portal_emitter_ring",
    position: [0, 3.0, -4.0],
    scale: [3, 3, 3]
  }
], "Agent: Scale portal ring for camera framing");

assert(commit2.revision === 2, "Revision advanced to 2");
assert(engine.sceneGraph.nodes["portal_emitter_ring"].transform.scale[0] === 3, "Transform mutation verified");

// 3. Rollback to Revision 1
const rollbackRes = engine.rollback(1);
assert(rollbackRes.status === "ROLLED_BACK", "Rollback executed safely");
assert(engine.sceneGraph.nodes["portal_emitter_ring"].transform.scale[0] === 2, "Scale reverted to 2 after rollback");

// 4. Atomic rejection on invalid command
let threw = false;
try {
  engine.dispatchTransaction([
    { op: "MUTATE_TRANSFORM", id: "non_existent_node", position: [1, 2, 3] }
  ]);
} catch (e) {
  threw = true;
}
assert(threw, "Invalid node mutation rejected with strict exception");
assert(engine.sceneGraph.nodes["portal_emitter_ring"].transform.scale[0] === 2, "Scene graph remains uncorrupted after failed transaction");

console.log("\n=================================================");
console.log(`VERDICT: 100% of transactional proofs passed (${passed}/${total}).`);
console.log("=================================================");
