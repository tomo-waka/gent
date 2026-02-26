import { createAjv, type JsonSchema } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";
import { vanillaCells, vanillaRenderers } from "@jsonforms/vanilla-renderers";
import type { ErrorObject } from "ajv";
import { useMemo, useState } from "react";
import "./App.css";
import {
  generationProfileSchema,
  initialGenerationProfile,
} from "./schema/generationProfileSchema";

function App() {
  const [profile, setProfile] = useState<Record<string, unknown>>(
    initialGenerationProfile,
  );
  const [errors, setErrors] = useState<ErrorObject[]>([]);

  const ajv = useMemo(() => {
    const instance = createAjv({ allErrors: true, strict: false });
    return instance;
  }, []);

  const generatedProfile = useMemo(
    () => JSON.stringify(profile, null, 2),
    [profile],
  );

  return (
    <main className="app">
      <header>
        <h1>GenT Profile Builder</h1>
        <p className="lead">
          Fill in the form generated from the GenT generation profile schema.
        </p>
      </header>

      <section className="panel">
        <h2>Profile Inputs</h2>
        <div className="formHost">
          <JsonForms
            ajv={ajv}
            cells={vanillaCells}
            data={profile}
            onChange={({ data, errors: nextErrors }) => {
              setProfile((data ?? {}) as Record<string, unknown>);
              setErrors(nextErrors ?? []);
            }}
            renderers={vanillaRenderers}
            schema={generationProfileSchema as JsonSchema}
          />
        </div>
        <p className="status" data-valid={errors.length === 0}>
          Validation:{" "}
          {errors.length === 0 ? "valid" : `${errors.length} issue(s)`}
        </p>
      </section>

      <section className="panel">
        <h2>Generated generation profile JSON</h2>
        <pre>{generatedProfile}</pre>
      </section>
    </main>
  );
}

export default App;
