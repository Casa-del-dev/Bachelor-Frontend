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

// Run arbitrary code, capturing its return or print output
export async function runCode(code: string): Promise<string> {
  const py = await getPyodide();
  let out = "";
  let err = "";
  // capture stdout and stderr
  py.setStdout({ batched: (s) => (out += s) });
  py.setStderr({ batched: (s) => (err += s) });
  try {
    const result = await py.runPythonAsync(code);
    if (err) return `❌ Runtime Error:\n${err.trim()}`;
    if (out) return out.trim();
    if (result !== undefined) return String(result);
    return "✅ Code ran successfully.";
  } catch (e: any) {
    return `❌ Runtime Error: ${e.toString()}`;
  } finally {
    // restore console hooks
    py.setStdout({ batched: (s) => console.log(s) });
    py.setStderr({ batched: (s) => console.error(s) });
  }
}

// Check syntax without executing (compile phase only)
export async function compileCode(code: string): Promise<string> {
  const py = await getPyodide();
  // escape triple-quotes
  const safe = code.replace(/"""/g, '\\"\\"\\"');
  try {
    // compile(...)
    await py.runPythonAsync(`compile("""${safe}""", "<input>", "exec")`);
    return "✅ Code compiles without errors.";
  } catch (err: any) {
    return `❌ SyntaxError: ${err.toString()}`;
  }
}

// Execute unittest-based tests
export async function testCode(code: string, tests: string): Promise<string> {
  const py = await getPyodide();
  let out = "";
  let err = "";
  // capture test-runner stdout & stderr
  py.setStdout({ batched: (s) => (out += s) });
  py.setStderr({ batched: (s) => (err += s) });

  const safeCode = code.replace(/"""/g, '\\"\\"\\"');
  const safeTests = tests.replace(/"""/g, '\\"\\"\\"');
  const runner = `
import sys, unittest, types
_namespace = {}
exec("""${safeCode}""", _namespace)
exec("""${safeTests}""", _namespace)
loader = unittest.TestLoader()
suite  = loader.loadTestsFromModule(types.SimpleNamespace(**_namespace))
runner = unittest.TextTestRunner(stream=sys.stdout, verbosity=2)
result = runner.run(suite)
if result.failures or result.errors:
    sys.exit(1)
`;
  try {
    await py.runPythonAsync(runner);
    if (err) return `❌ Runtime Error:\n${err.trim()}`;
    return out.trim() || "✅ All tests passed!";
  } catch (e: any) {
    return `❌ Test failed: ${e.toString()}`;
  } finally {
    // restore console.log behavior
    py.setStdout({ batched: (s) => console.log(s) });
    py.setStderr({ batched: (s) => console.error(s) });
  }
}
