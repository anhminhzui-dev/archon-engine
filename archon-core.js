/**
 * ArchonEngine: Autonomous Agent Transactional 3D Scene Graph Synthesizer
 * Author: Vo Ba Hoang Minh (anhminhzui-dev)
 * License: MIT
 *
 * Description:
 * Headless, deterministic 3D scene execution engine designed for LLM and Vision agents
 * to inspect, mutate, and verify procedural 3D environments via atomic JSON-RPC transactions.
 */

export class ArchonEngine {
  constructor() {
    this.revision = 0;
    this.history = [];
    this.sceneGraph = {
      version: "1.0.0",
      metadata: {
        created_at: new Date().toISOString(),
        author: "Agentic-Headless-Kernel"
      },
      nodes: {},
      materials: {},
      emitters: {}
    };
    
    // Initial root node
    this.sceneGraph.nodes["root"] = {
      id: "root",
      type: "Group",
      transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
      children: []
    };

    this.saveRevision("Initial empty scene graph");
  }

  /**
   * Generates a deterministic state checksum
   */
  computeChecksum(stateObj) {
    const str = JSON.stringify(stateObj);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  saveRevision(description) {
    const snapshot = JSON.parse(JSON.stringify(this.sceneGraph));
    const checksum = this.computeChecksum(snapshot);
    this.history.push({
      revision: this.revision,
      timestamp: Date.now(),
      description: description,
      checksum: checksum,
      state: snapshot
    });
    this.revision++;
    return checksum;
  }

  /**
   * Dispatches a batch of transactional scene mutations
   * @param {Array<Object>} commands - Array of JSON-RPC mutation commands
   * @param {string} [commitMessage]
   */
  dispatchTransaction(commands, commitMessage = "Agent batch mutation") {
    // Stage candidate state
    const candidate = JSON.parse(JSON.stringify(this.sceneGraph));

    for (const cmd of commands) {
      switch (cmd.op) {
        case "CREATE_NODE": {
          const { id, type, transform = {}, parent = "root" } = cmd;
          if (candidate.nodes[id]) {
            throw new Error(`Archon: Node ID ${id} already exists.`);
          }
          candidate.nodes[id] = {
            id,
            type: type || "Mesh",
            transform: {
              position: transform.position || [0, 0, 0],
              rotation: transform.rotation || [0, 0, 0],
              scale: transform.scale || [1, 1, 1]
            },
            materialId: cmd.materialId || null,
            children: []
          };
          if (candidate.nodes[parent]) {
            candidate.nodes[parent].children.push(id);
          }
          break;
        }

        case "MUTATE_TRANSFORM": {
          const { id, position, rotation, scale } = cmd;
          if (!candidate.nodes[id]) {
            throw new Error(`Archon: Target node ID ${id} not found.`);
          }
          if (position) candidate.nodes[id].transform.position = position;
          if (rotation) candidate.nodes[id].transform.rotation = rotation;
          if (scale) candidate.nodes[id].transform.scale = scale;
          break;
        }

        case "SET_MATERIAL": {
          const { id, color, roughness, metalness, proceduralNoise } = cmd;
          candidate.materials[id] = {
            id,
            color: color || "#ffffff",
            roughness: roughness !== undefined ? roughness : 0.5,
            metalness: metalness !== undefined ? metalness : 0.0,
            proceduralNoise: proceduralNoise || null
          };
          break;
        }

        case "SET_EMITTER": {
          const { id, particleCount, emissionRate, lifetime, color } = cmd;
          candidate.emitters[id] = {
            id,
            particleCount: particleCount || 1000,
            emissionRate: emissionRate || 100,
            lifetime: lifetime || 2.0,
            color: color || "#ffaa00"
          };
          break;
        }

        case "DELETE_NODE": {
          const { id } = cmd;
          delete candidate.nodes[id];
          // Remove reference from parents
          for (const n of Object.values(candidate.nodes)) {
            n.children = n.children.filter(childId => childId !== id);
          }
          break;
        }

        default:
          throw new Error(`Archon: Unknown transaction operation ${cmd.op}`);
      }
    }

    // Atomic commit
    this.sceneGraph = candidate;
    const checksum = this.saveRevision(commitMessage);
    return {
      status: "COMMITTED",
      revision: this.revision - 1,
      checksum: checksum,
      nodeCount: Object.keys(this.sceneGraph.nodes).length
    };
  }

  /**
   * Rolls back the scene graph to a specific historical revision
   */
  rollback(targetRevision) {
    const entry = this.history.find(h => h.revision === targetRevision);
    if (!entry) {
      throw new Error(`Archon: Revision ${targetRevision} does not exist in history.`);
    }
    this.sceneGraph = JSON.parse(JSON.stringify(entry.state));
    const checksum = this.saveRevision(`Rollback to revision ${targetRevision}`);
    return {
      status: "ROLLED_BACK",
      currentRevision: this.revision - 1,
      targetRevision: targetRevision,
      checksum: checksum
    };
  }

  /**
   * Exports the entire scene graph as a standardized JSON payload
   */
  exportScene() {
    return JSON.stringify(this.sceneGraph, null, 2);
  }
}
