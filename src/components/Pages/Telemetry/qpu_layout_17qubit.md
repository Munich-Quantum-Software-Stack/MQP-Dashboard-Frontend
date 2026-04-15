# QPU Layout: 17-Qubit Superconducting Chip

## Connection Representation Formats

When plotting a superconducting QPU as a graph, the qubit positions can be expressed as normalized coordinates on a (0,1) plane. For the connections, here are the main representation alternatives:

### 1. Edge List *(recommended as source of truth)*

A flat list of qubit pairs. Minimal, unambiguous, and easy to serialize as JSON. Ideal when edges carry metadata (e.g. coupling strength, gate fidelity).

```python
edges = [
  (0,1),(1,2),(2,3),(3,4),
  (4,5),(5,6),
  (6,7),(7,8),(8,9),(9,2),
  (8,10),(10,11),(11,12),
  (12,13),(13,14),(14,15),(15,16),
  (10,13),(8,14),(6,16),
]
```

To attach metadata per edge:
```python
edges_with_meta = [
    (0, 1, {"fidelity": 0.998, "coupling_strength": 0.012}),
    (1, 2, {"fidelity": 0.995, "coupling_strength": 0.011}),
    # ...
]
```

---

### 2. Adjacency List *(best for rendering)*

A dictionary mapping each qubit to its list of neighbors. Cheap to iterate, directly consumable by graph renderers.

```python
from collections import defaultdict

adj = defaultdict(list)
for a, b in edges:
    adj[a].append(b)
    adj[b].append(a)

# Example: adj[8] → [7, 9, 10, 14]  (degree-4 hub qubit)
```

---

### 3. Interaction / Coupling Matrix

A symmetric N×N matrix where entry `[i][j]` holds 1 (or a float for coupling strength) if qubits i and j are coupled. Intuitive for dense chips and directly usable for matrix operations. Scales as O(N²) — fine for 17 qubits, heavy for 1000+.

```python
import numpy as np

N = 17
coupling_matrix = np.zeros((N, N))
for a, b in edges:
    coupling_matrix[a][b] = 1
    coupling_matrix[b][a] = 1

# Or with coupling strengths:
# coupling_matrix[a][b] = coupling_matrix[b][a] = 0.012
```

---

### 4. Graph Object *(best for algorithms)*

Use when doing anything beyond rendering: shortest paths, graph coloring, subgraph isomorphism for circuit routing. `rustworkx` (used by Qiskit) is purpose-built for this.

```python
import rustworkx as rx

graph = rx.PyGraph()
graph.add_nodes_from(range(17))
graph.add_edges_from_no_data(edges)
```

Or with NetworkX:
```python
import networkx as nx

G = nx.Graph()
G.add_edges_from(edges)
```

---

## Recommended Pipeline

> **Store** `qubit_positions` + `edges` → **derive** adjacency list at render time → **pass** both to your graph renderer (D3 force, Cytoscape.js, or NetworkX for server-side layout).

---

## 17-Qubit Heavy-Hex Layout

The topology used is **IBM's heavy-hex** (as in `ibmq_guadalupe`). Qubits sit on a hexagonal lattice with reduced connectivity to lower crosstalk. There are two qubit roles:

| Role | Description |
|------|-------------|
| **Data qubit** | Carries the logical quantum information |
| **Ancilla / measure qubit** | Used for stabilizer measurements and error correction |

### Normalized Qubit Positions — (0,1)² plane

```python
qubit_positions = {
     0: (0.00, 0.00),   # data
     1: (0.25, 0.00),   # ancilla
     2: (0.50, 0.00),   # data
     3: (0.75, 0.00),   # ancilla
     4: (1.00, 0.00),   # data
     5: (1.00, 0.33),   # ancilla
     6: (1.00, 0.67),   # data
     7: (0.75, 0.67),   # ancilla
     8: (0.50, 0.67),   # data      ← degree-4 hub
     9: (0.50, 0.33),   # ancilla
    10: (0.25, 0.67),   # data
    11: (0.00, 0.67),   # ancilla
    12: (0.00, 1.00),   # data
    13: (0.25, 1.00),   # ancilla
    14: (0.50, 1.00),   # data
    15: (0.75, 1.00),   # ancilla
    16: (1.00, 1.00),   # data
}
```

### Edge List

```python
edges = [
    # Top row (horizontal)
    (0, 1), (1, 2), (2, 3), (3, 4),
    # Right column (vertical)
    (4, 5), (5, 6),
    # Middle band
    (6, 7), (7, 8), (8, 9), (9, 2),
    (8, 10), (10, 11), (11, 12),
    # Bottom row (horizontal)
    (12, 13), (13, 14), (14, 15), (15, 16),
    # Cross-connects
    (10, 13), (8, 14), (6, 16),
]
```

### Qubit Connectivity Summary

| Qubit | Role | Neighbors | Degree |
|-------|------|-----------|--------|
| 0 | data | 1 | 1 |
| 1 | ancilla | 0, 2 | 2 |
| 2 | data | 1, 3, 9 | 3 |
| 3 | ancilla | 2, 4 | 2 |
| 4 | data | 3, 5 | 2 |
| 5 | ancilla | 4, 6 | 2 |
| 6 | data | 5, 7, 16 | 3 |
| 7 | ancilla | 6, 8 | 2 |
| 8 | **data** | 7, 9, 10, 14 | **4** |
| 9 | ancilla | 8, 2 | 2 |
| 10 | data | 8, 11, 13 | 3 |
| 11 | ancilla | 10, 12 | 2 |
| 12 | data | 11, 13 | 2 |
| 13 | ancilla | 12, 14, 10 | 3 |
| 14 | data | 13, 15, 8 | 3 |
| 15 | ancilla | 14, 16 | 2 |
| 16 | data | 15, 6 | 2 |

Qubit **8** is the highest-degree hub in this topology (degree 4).

---

## ASCII Topology Sketch

```
Q0 — Q1 — Q2 — Q3 — Q4
               |         |
               Q9        Q5
               |         |
Q11— Q10— Q8 — Q7 — Q6
|         |    |         |
Q12  Q13  Q14  Q15  Q16
     |    |         |
    (10) (8)       (6)
```

---

*Topology: IBM heavy-hex (ibmq_guadalupe style) — 17 qubits, 20 couplers.*
