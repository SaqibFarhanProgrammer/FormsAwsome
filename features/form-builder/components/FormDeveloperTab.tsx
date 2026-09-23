"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { FormType } from "../models/form-builder.model";

// npm install prism-react-renderer  (if not already in the project)

function CodeBlock({ code, language }: { code: string; language: "markup" | "tsx" }) {
  return (
    <Highlight theme={themes.vsDark} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} overflow-x-auto rounded-md p-4 text-xs leading-relaxed`}
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <Button onClick={copy} variant="outline" size="sm">
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

const escapeHtmlAttribute = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function FormDeveloperTab({ formData }: { formData: FormType }) {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(600);
  const formPath = `/f/${formData.slug}`;
  const safeTitle = escapeHtmlAttribute(formData.title);

  const htmlSnippet = `<iframe
  src="http://localhost:3000${formPath}"
  width="${width}%"
  height="${height}"
  style="border:0;"
  title="${safeTitle}"
></iframe>`;

  const reactSnippet = `export function EmbeddedForm() {
  return (
    <iframe
      src="http://localhost:3000${formPath}"
      width="${width}%"
      height={${height}}
      style={{ border: 0 }}
      title="${safeTitle}"
    />
  );
}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Embed your form</CardTitle>
              <CardDescription className="mt-1">
                Copy this plain HTML iframe into any platform that accepts custom HTML.
              </CardDescription>
            </div>
            <CopyButton code={htmlSnippet} />
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-xs font-medium">
              <span>Width</span>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  value={width}
                  onChange={(event) => setWidth(Math.max(1, Number(event.target.value)))}
                  className="pr-7"
                />
                <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-muted-foreground">
                  %
                </span>
              </div>
            </label>
            <label className="space-y-1.5 text-xs font-medium">
              <span>Height</span>
              <Input
                type="number"
                min="1"
                value={height}
                onChange={(event) => setHeight(Math.max(1, Number(event.target.value)))}
              />
            </label>
          </div>
          <CodeBlock code={htmlSnippet} language="markup" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform guidance</CardTitle>
          <CardDescription>Open a platform to see where to paste the snippet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            ["WordPress", 'Add a "Custom HTML" block and paste the snippet inside it.'],
            [
              "Shopify",
              'In the theme editor, add a "Custom Liquid" section or block and paste the snippet inside it.',
            ],
            ["Webflow", 'Add an "Embed" element and paste the snippet inside it.'],
            ["Squarespace", 'Add a "Code Block" and paste the snippet inside it.'],
          ].map(([platform, guidance]) => (
            <details key={platform} className="rounded-md border border-border px-3 py-2">
              <summary className="cursor-pointer text-sm font-medium">{platform}</summary>
              <p className="pt-2 text-xs leading-relaxed text-muted-foreground">{guidance}</p>
            </details>
          ))}

          <details className="rounded-md border border-border px-3 py-2">
            <summary className="cursor-pointer text-sm font-medium">
              React / any JS framework
            </summary>
            <div className="space-y-3 pt-2">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Drop this component in wherever the form should render.
              </p>
              <div className="flex justify-end">
                <CopyButton code={reactSnippet} />
              </div>
              <CodeBlock code={reactSnippet} language="tsx" />
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
