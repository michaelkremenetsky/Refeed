import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";
import { EditorView } from "@uiw/react-codemirror";

// NOTE: Not in use for now

export const editorTheme = createTheme({
  theme: "light",
  settings: {
    background: "#ffffff",
    foreground: "#4D4D4C",
    caret: "#AEAFAD",
    selection: "#D6D6D6",
    selectionMatch: "#D6D6D6",
    gutterBackground: "#FFFFFF",
    gutterForeground: "#4D4D4C",
    gutterBorder: "#dddddd",
    gutterActiveForeground: "",
    lineHighlight: "#EFEFEF",
  },
  styles: [
    { tag: t.comment, color: "#787b80" },
    { tag: t.definition(t.typeName), color: "#194a7b" },
    { tag: t.typeName, color: "#194a7b" },
    { tag: t.tagName, color: "#008a02" },
    { tag: t.variableName, color: "#1a00db" },
  ],
});

export const borderTheme = EditorView.baseTheme({
  "&.cm-editor.cm-focused": {
    outline: "none",
  },
});
