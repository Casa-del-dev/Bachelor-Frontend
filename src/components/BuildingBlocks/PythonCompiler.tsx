import { loadPyodide, PyodideInterface } from "pyodide";

let pyodide: PyodideInterface | null = null;
let persistentNs: any = null;

async function getPyodide() {
  if (!pyodide) {
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/",
    });
    pyodide.registerJsModule("frontend", {
      input: () => prompt("Input requested:"),
    });
  }
  return pyodide;
}

export async function runCode(code: string): Promise<string> {
  const py = await getPyodide();
  let out = "";
  let err = "";

  // 1) On first call, create a persistent namespace (_persistent_ns) in Python
  if (!persistentNs) {
    await py.runPythonAsync(`
import builtins
_persistent_ns = { "__builtins__": builtins, "__name__": "__main__" }
`);
    persistentNs = py.globals.get("_persistent_ns");
  }

  // 2) Capture stdout / stderr into our JS strings
  py.setStdout({ batched: (s) => (out += s) });
  py.setStderr({ batched: (s) => (err += s) });

  // 3) Escape triple quotes so we can wrap the snippet safely
  const safe = code.replace(/"""/g, '\\"\\"\\"');

  // 4) Build a wrapper that:
  //    - Tries eval(...) on the snippet in _persistent_ns
  //    - If it returns something non‐None, print it
  //    - If eval raises SyntaxError, fallback to exec(...)
  const wrapper = `
try:
    _res = eval("""${safe}""", _persistent_ns, _persistent_ns)
    if _res is not None:
        print(_res)
except SyntaxError:
    exec("""${safe}""", _persistent_ns, _persistent_ns)
`;

  try {
    // 5) Run the wrapper. Any prints go into `out`.
    await py.runPythonAsync(wrapper);

    if (err) {
      const cleanErr = err.replace(/\n+$/, "");
      return `❌ Error:\n${cleanErr}`;
    }
    if (out) {
      return out.replace(/\n+$/, "");
    }
    return "";
  } catch (e: any) {
    const msg = e.toString().replace(/\n+$/, "");
    return `❌ Runtime Error: ${msg}`;
  } finally {
    // 6) Restore stdout/stderr to console
    py.setStdout({ batched: (s) => console.log(s) });
    py.setStderr({ batched: (s) => console.error(s) });
  }
}

export async function compileCode(code: string): Promise<string> {
  const py = await getPyodide();
  const safe = code.replace(/"""/g, '\\"\\"\\"');
  try {
    await py.runPythonAsync(`compile("""${safe}""", "<input>", "exec")`);
    return "✅ Code compiles without errors.";
  } catch (err: any) {
    return `❌ SyntaxError: ${err.toString()}`;
  }
}

export async function testCode(
  sources: string[],
  tests: string
): Promise<string> {
  const py = await getPyodide();
  let out = "";
  let err = "";

  await py.runPythonAsync(`
globals().clear()
import builtins
globals()["__builtins__"] = builtins
`);

  py.setStdout({ batched: (s) => (out += s) });
  py.setStderr({ batched: (s) => (err += s) });

  const escapedSources = sources.map((c) => c.replace(/"""/g, '\\"\\"\\"'));
  const escapedTests = tests.replace(/"""/g, '\\"\\"\\"');

  const runner = `
import sys, unittest, types
_namespace = {}

${escapedSources.map((src) => `exec("""${src}""", _namespace)`).join("\n")}

exec("""${escapedTests}""", _namespace)

loader = unittest.TestLoader()
suite  = loader.loadTestsFromModule(types.SimpleNamespace(**_namespace))
runner = unittest.TextTestRunner(stream=sys.stdout, verbosity=2)
result = runner.run(suite)
if result.failures or result.errors:
    sys.exit(1)
`;

  try {
    await py.runPythonAsync(runner);
    if (err.trim().length > 0) {
      const cleanErr = err.replace(/\n+$/, "");
      return `❌ Runtime Error:\n${cleanErr}`;
    }
    return out.trim() || "[OK] All tests passed!";
  } catch (e: any) {
    const msg = e.toString().replace(/\n+$/, "");
    return `❌ Test failed: ${msg}`;
  } finally {
    py.setStdout({ batched: (s) => console.log(s) });
    py.setStderr({ batched: (s) => console.error(s) });
  }
}
