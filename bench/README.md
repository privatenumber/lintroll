# Benchmarks

Run the one-shot CLI benchmark with `pnpm bench`.

Run the generated config benchmark with `pnpm bench:config`. Set `LINTROLL_MODE=fast` to measure fast mode.

Run ESLint's per-rule timing report with `pnpm bench:rules`.

Run generated-config rule timing with `pnpm bench:config:rules`. Set `LINTROLL_MODE=fast` to compare fast mode.

Benchmark results depend on the machine and current git-tracked files. Compare runs on the same machine with no competing workloads.
