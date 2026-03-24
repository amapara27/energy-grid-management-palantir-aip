/**
 * TransformerToCircuit Link Type
 *
 * Defines a many-to-one relationship: each Transformer belongs to exactly one Circuit,
 * and a Circuit can contain many Transformers.
 *
 * @see Requirements 2.5
 */

import type { Transformer } from "../Objects/Transformer.js";
import type { Circuit } from "../Objects/Circuit.js";

export interface TransformerToCircuitLink {
  /** The transformer (many side) */
  transformer: Transformer;
  /** The parent circuit (one side) */
  circuit: Circuit;
}

/**
 * Resolves the parent Circuit for a given Transformer.
 * Stub — throws until implemented.
 */
export function getCircuitForTransformer(_transformerId: string): Circuit {
  throw new Error("Not implemented");
}

/**
 * Resolves all Transformers belonging to a given Circuit.
 * Stub — throws until implemented.
 */
export function getTransformersForCircuit(_circuitId: string): Transformer[] {
  throw new Error("Not implemented");
}
