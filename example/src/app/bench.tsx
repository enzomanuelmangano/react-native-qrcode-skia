import * as React from 'react';
import { Redirect } from 'expo-router';
import { Profiler, useEffect, useReducer, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { current, type Impl } from '../bench/impls';

// Benchmark screen (not part of the app). Measure production JS on a device:
//   node scripts/bench-collector.mjs
//   cd example && npx expo start --no-dev --minify   # then open /bench
// It runs automatically and sends one JSON line per result to the collector
// (production builds don't forward console logs to Metro).

const IMPLS: Impl[] = [current];
const COUNTS = [12, 24, 48];
const RUNS = 5;
const SIZE = 80;
const makeValues = (run: number) =>
  Array.from(
    { length: 48 },
    (_, i) =>
      `https://qrcode.reactiive.io/item/${i}?ref=bench&run=${run}&campaign=perf-${i * 7919}`
  );
const VALUES = makeValues(0);
let runId = 1;
const SCENARIOS = {
  rounded: { shapeOptions: undefined, logo: false },
  circle: {
    shapeOptions: { shape: 'circle', eyePatternShape: 'rounded' },
    logo: true,
  },
} as const;

const median = (xs: number[]) =>
  [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]!;
const nextFrame = () =>
  new Promise<void>((r) => requestAnimationFrame(() => r()));
const log = (o: object) => {
  console.log('BENCH ' + JSON.stringify(o));
  fetch('http://127.0.0.1:8099', {
    method: 'POST',
    body: JSON.stringify(o),
  }).catch(() => {});
};

type Mount = {
  impl: Impl;
  count: number;
  scenario: keyof typeof SCENARIOS;
  key: number;
  values: string[];
};

function Bench() {
  const [mount, setMount] = useState<Mount | null>(null);
  const [, rerender] = useReducer((x: number) => x + 1, 0);
  const [status, setStatus] = useState('starting');
  const commits = React.useRef(0);

  useEffect(() => {
    (async () => {
      await nextFrame();
      // 1) Pipeline only (value -> SkPath), no React.
      for (const [scenario, { shapeOptions, logo }] of Object.entries(
        SCENARIOS
      )) {
        for (const impl of IMPLS) {
          const times: number[] = [];
          for (let r = 0; r < RUNS; r++) {
            const t = performance.now();
            for (const v of VALUES)
              impl.buildPath(v, SIZE, shapeOptions as any, logo ? 20 : 0);
            times.push(performance.now() - t);
          }
          log({
            kind: 'pipeline',
            impl: impl.name,
            scenario,
            n: VALUES.length,
            ms: median(times),
          });
        }
      }
      // 1b) Same pipeline split by phase.
      for (const [scenario, { shapeOptions, logo }] of Object.entries(
        SCENARIOS
      )) {
        for (const impl of IMPLS) {
          const acc = {
            modules: [] as number[],
            path: [] as number[],
            parse: [] as number[],
          };
          let bytes = 0;
          for (let r = 0; r < RUNS; r++) {
            let m = 0,
              p = 0,
              s = 0;
            bytes = 0;
            for (const v of VALUES) {
              let t = performance.now();
              const mods = impl.phases.modules(v);
              m += performance.now() - t;
              t = performance.now();
              const svg = impl.phases.path(
                mods,
                SIZE,
                shapeOptions as any,
                logo ? 20 : 0
              );
              p += performance.now() - t;
              bytes += svg.length;
              t = performance.now();
              impl.phases.parse(svg);
              s += performance.now() - t;
            }
            acc.modules.push(m);
            acc.path.push(p);
            acc.parse.push(s);
          }
          log({
            kind: 'phases',
            impl: impl.name,
            scenario,
            n: VALUES.length,
            modules: median(acc.modules),
            path: median(acc.path),
            parse: median(acc.parse),
            kb: Math.round(bytes / 1024),
          });
        }
      }
      // 2) Mount N QR codes until the next frame, 3) re-render with inline props.
      for (const scenario of Object.keys(
        SCENARIOS
      ) as (keyof typeof SCENARIOS)[]) {
        for (const count of COUNTS) {
          for (const impl of IMPLS) {
            const mountTimes: number[] = [];
            const remountTimes: number[] = [];
            const rerenderTimes: number[] = [];
            for (let r = 0; r < RUNS; r++) {
              // Values never seen before: nothing cached anywhere.
              const values = makeValues(runId++);
              setMount(null);
              await nextFrame();
              await nextFrame();
              const t = performance.now();
              setMount({ impl, count, scenario, key: r, values });
              await nextFrame();
              await nextFrame();
              mountTimes.push(performance.now() - t);

              const t2 = performance.now();
              for (let i = 0; i < 5; i++) {
                rerender();
                await nextFrame();
              }
              rerenderTimes.push((performance.now() - t2) / 5);

              // Same values again (e.g. navigating back to a list).
              setMount(null);
              await nextFrame();
              await nextFrame();
              const t3 = performance.now();
              setMount({ impl, count, scenario, key: r + 100, values });
              await nextFrame();
              await nextFrame();
              remountTimes.push(performance.now() - t3);
            }
            log({
              kind: 'remount',
              impl: impl.name,
              scenario,
              count,
              ms: median(remountTimes),
            });
            log({
              kind: 'mount',
              impl: impl.name,
              scenario,
              count,
              ms: median(mountTimes),
            });
            log({
              kind: 'rerender',
              impl: impl.name,
              scenario,
              count,
              ms: median(rerenderTimes),
            });
            setStatus(`${scenario} ${count} ${impl.name}`);
          }
        }
      }
      setMount(null);
      setStatus('done');
      log({ kind: 'done' });
    })();
  }, []);

  const scenario = mount ? SCENARIOS[mount.scenario] : null;
  return (
    <View style={styles.root}>
      <Text style={styles.status}>{status}</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {mount && scenario && (
          <Profiler id="qr" onRender={() => commits.current++}>
            {mount.values.slice(0, mount.count).map((v) => (
              <mount.impl.QRCode
                key={`${mount.key}-${v}`}
                value={v}
                size={SIZE}
                color="#4a90d9"
                // Inline object on purpose: the common way apps pass it.
                shapeOptions={
                  scenario.shapeOptions
                    ? { ...scenario.shapeOptions }
                    : undefined
                }
                logo={scenario.logo ? <Text>🐨</Text> : undefined}
                logoAreaSize={scenario.logo ? 20 : undefined}
              />
            ))}
          </Profiler>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', paddingTop: 60 },
  status: { color: '#fff', textAlign: 'center', marginBottom: 8 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
});

// Development tool for native builds: not served on the website.
export default function Screen() {
  return Platform.OS === 'web' ? <Redirect href="/" /> : <Bench />;
}
