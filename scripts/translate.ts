import fs from "fs";
import path from "path";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const LOCALES_DIR = path.join(process.cwd(), "locales");
const SOURCE_LOCALE = "en";

const languageNames: Record<string, string> = {
  ga: "Irish (Gaeilge)",
  zh: "Chinese (Simplified)",
  uk: "Ukrainian",
  ro: "Romanian",
  pl: "Polish",
  lt: "Lithuanian",
  pt: "Portuguese",
  es: "Spanish",
  fr: "French",
  de: "German",
};

interface AIRequestOptions {
  provider: "openai" | "gemini";
  apiKey: string;
  model: string;
}

async function translateBatch(
  batch: Record<string, string>,
  targetLangName: string,
  options: AIRequestOptions
): Promise<Record<string, string>> {
  const prompt = `You are a professional translator. Translate the values of the following JSON object from English to ${targetLangName}.
Keep all JSON keys exactly the same. Do not translate the keys.
Keep all formatting placeholders (like <emailLink>, </emailLink>, etc.) exactly as they are in the target text.
Do not format the output with markdown blocks like \`\`\`json. Return ONLY a raw, valid JSON object.

JSON object to translate:
${JSON.stringify(batch, null, 2)}`;

  if (options.provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional translator that outputs only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API request failed: ${res.statusText} - ${errText}`);
    }

    const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
    const content = data.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from OpenAI API");
    return JSON.parse(content.trim()) as Record<string, string>;
  } else {
    const modelName = options.model || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${options.apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API request failed: ${res.statusText} - ${errText}`);
    }

    const data = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from Gemini API");
    return JSON.parse(text.trim()) as Record<string, string>;
  }
}

async function main() {
  const args = process.argv.slice(2);

  const aiProvider =
    process.env.AI_PROVIDER ||
    (process.env.OPENAI_API_KEY || process.env.AI_API_KEY?.startsWith("sk-") ? "openai" : "gemini");
  const aiApiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
  const aiModel = process.env.AI_MODEL || (aiProvider === "openai" ? "gpt-4o-mini" : "gemini-2.5-flash");

  if (!aiApiKey) {
    console.error(
      "Error: No AI API Key detected. Please set AI_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY in .env or .env.local"
    );
    process.exit(1);
  }

  const options: AIRequestOptions = {
    provider: aiProvider as "openai" | "gemini",
    apiKey: aiApiKey,
    model: aiModel,
  };

  console.log(`Using AI Provider: ${options.provider} with model ${options.model}`);

  const sourcePath = path.join(LOCALES_DIR, `${SOURCE_LOCALE}.json`);
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source locale file not found: ${sourcePath}`);
    process.exit(1);
  }

  const sourceData = JSON.parse(fs.readFileSync(sourcePath, "utf-8")) as Record<string, string>;
  const sourceKeys = Object.keys(sourceData);

  let targetLocales: string[] = [];
  if (args.length > 0) {
    targetLocales = args.map((arg) => arg.replace(/\.json$/, ""));
  } else {
    targetLocales = ["ga", "zh", "uk", "ro", "pl", "lt", "pt", "es", "fr", "de"];
  }

  for (const locale of targetLocales) {
    const targetPath = path.join(LOCALES_DIR, `${locale}.json`);
    let targetData: Record<string, string> = {};

    if (fs.existsSync(targetPath)) {
      targetData = JSON.parse(fs.readFileSync(targetPath, "utf-8")) as Record<string, string>;
    }

    const langName = languageNames[locale] || locale;
    console.log(`\nProcessing translations for [${locale}] - ${langName}...`);

    const missingKeys = sourceKeys.filter((key) => !targetData[key]);
    if (missingKeys.length === 0) {
      console.log(`No missing keys found for ${locale}.`);
      continue;
    }

    console.log(`Found ${missingKeys.length} missing keys. Translating...`);

    const chunkSize = 40;
    const translatedData: Record<string, string> = { ...targetData };

    for (let i = 0; i < missingKeys.length; i += chunkSize) {
      const batchKeys = missingKeys.slice(i, i + chunkSize);
      const batchObject: Record<string, string> = {};
      for (const key of batchKeys) {
        batchObject[key] = sourceData[key];
      }

      console.log(`  Translating batch ${Math.floor(i / chunkSize) + 1}/${Math.ceil(missingKeys.length / chunkSize)}...`);
      try {
        const translations = await translateBatch(batchObject, langName, options);
        for (const key of batchKeys) {
          if (translations[key]) {
            translatedData[key] = translations[key];
          } else {
            console.warn(`  Warning: Key "${key}" was missing in translation output.`);
          }
        }
      } catch (err) {
        console.error(`  Error translating batch:`, err);
        console.log("  Stopping translation process for this language.");
        break;
      }
    }

    const sortedData: Record<string, string> = {};
    const sortedKeys = Object.keys(translatedData).sort();
    for (const key of sortedKeys) {
      sortedData[key] = translatedData[key];
    }

    fs.writeFileSync(targetPath, JSON.stringify(sortedData, null, 2) + "\n", "utf-8");
    console.log(`Successfully updated ${targetPath}`);
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
