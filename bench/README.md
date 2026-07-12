# Benchmarks

Run the one-shot CLI benchmark with `pnpm bench`.

Run the generated config benchmark with `pnpm bench:config`. Pass `--fast` to measure fast mode:

```sh
pnpm bench:config --fast
```

Run ESLint's per-rule timing report with `pnpm bench:rules`.

Run generated-config rule timing with `pnpm bench:config:rules`. Pass `--fast` to compare fast mode:

```sh
pnpm bench:config:rules --fast
```

Benchmark results depend on the machine and current git-tracked files. Compare runs on the same machine with no competing workloads.
