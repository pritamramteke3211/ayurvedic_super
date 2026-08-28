/**
 * @file scripts/patch-codegen.js
 * @description Auto-patch for @react-native/codegen and react-native-screens for React 19 compatibility.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Patch @react-native/codegen
const codegenCommandsPath = path.join(
  ROOT_DIR,
  'node_modules/@react-native/codegen/lib/parsers/typescript/components/commands.js',
);

if (fs.existsSync(codegenCommandsPath)) {
  let content = fs.readFileSync(codegenCommandsPath, 'utf8');
  if (!content.includes('isElementOrComponentRef')) {
    content = content.replace(
      /function buildCommandSchemaInternal\(name, optional, parameters, types, parser\) \{[\s\S]*?if \([\s\S]*?throw new Error\([\s\S]*?\);\s*\}/m,
      `function buildCommandSchemaInternal(name, optional, parameters, types, parser) {
  var _firstParam$typeAnnot;
  const firstParam = parameters[0].typeAnnotation;
  const isReact =
    firstParam.typeAnnotation != null &&
    firstParam.typeAnnotation.type === 'TSTypeReference' &&
    ((_firstParam$typeAnnot = firstParam.typeAnnotation.typeName.left) ===
      null || _firstParam$typeAnnot === void 0
      ? void 0
      : _firstParam$typeAnnot.name) === 'React';

  const typeRight =
    firstParam.typeAnnotation != null &&
    firstParam.typeAnnotation.typeName != null &&
    firstParam.typeAnnotation.typeName.right != null
      ? firstParam.typeAnnotation.typeName.right.name
      : null;

  const isElementOrComponentRef =
    typeRight === 'ElementRef' || typeRight === 'ComponentRef';

  if (!isReact || !isElementOrComponentRef) {
    throw new Error(
      \`The first argument of method \${name} must be of type React.ElementRef<> or React.ComponentRef<>\`,
    );
  }`,
    );
    fs.writeFileSync(codegenCommandsPath, content, 'utf8');
    console.log('✅ Patched @react-native/codegen for React 19 ComponentRef');
  }
}

// 2. Patch react-native-screens fabric components if present
const screensFabricFiles = [
  'node_modules/react-native-screens/src/fabric/gamma/split/SplitHostNativeComponent.ts',
  'node_modules/react-native-screens/src/fabric/SearchBarNativeComponent.ts',
  'node_modules/react-native-screens/src/fabric/gamma/stack/StackHeaderConfigIOSNativeComponent.ts',
  'node_modules/react-native-screens/src/fabric/gamma/stack/StackHeaderConfigAndroidNativeComponent.ts',
];

for (const rel of screensFabricFiles) {
  const fullPath = path.join(ROOT_DIR, rel);
  if (fs.existsSync(fullPath)) {
    let code = fs.readFileSync(fullPath, 'utf8');
    if (code.includes('React.ComponentRef')) {
      code = code.replace(/React\.ComponentRef/g, 'React.ElementRef');
      fs.writeFileSync(fullPath, code, 'utf8');
      console.log(`✅ Patched ${rel}`);
    }
  }
}
