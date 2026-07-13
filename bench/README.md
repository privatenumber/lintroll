# Benchmarks

Run the one-shot CLI benchmark with `pnpm bench`.

Run ESLint's per-rule timing report with `pnpm bench:rules`.

Compare one-shot ESLint, Oxlint, and hybrid execution with `pnpm bench:hybrid`.
The benchmark passes the same git-tracked, Oxlint-supported files to every variant.

Benchmark results depend on the machine and current git-tracked files. Compare runs on the same machine with no competing workloads.
