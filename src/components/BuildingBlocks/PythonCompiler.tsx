import { loadPyodide, PyodideInterface } from "pyodide";

let pyodide: PyodideInterface | null = null;

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

  // ─── 1) Always hook stdout/stderr, re‐appending a "\n" to each batched chunk ───
  py.setStdout({ batched: (s) => (out += s + "\n") });
  py.setStderr({ batched: (s) => (err += s + "\n") });

  // ─── 2) Escape triple‐quotes in the user code so we can wrap it safely ───
  const safe = code.replace(/"""/g, '\\"\\"\\"');

  // ─── 3) The wrapper: make sure _persistent_ns exists every call, then eval/exec ───
  const wrapper = `
try:
    _persistent_ns
except NameError:
    import builtins
    _persistent_ns = { "__builtins__": builtins, "__name__": "__main__" }

try:
    _res = eval("""${safe}""", _persistent_ns, _persistent_ns)
    if _res is not None:
        print(_res)
except SyntaxError:
    exec("""${safe}""", _persistent_ns, _persistent_ns)
`;

  try {
    await py.runPythonAsync(wrapper);

    // If Python wrote to stderr, return that as an “Error” block
    if (err.trim().length > 0) {
      return `❌ Error:\n${err.trim()}`;
    }
    // Otherwise, return whatever was printed
    return out;
  } catch (e: any) {
    // In case runPythonAsync itself threw (e.g. runtime error)
    return `❌ Runtime Error: ${e}`;
  } finally {
    // ─── 4) Restore Pyodide’s default stdout/stderr hooks ───
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
