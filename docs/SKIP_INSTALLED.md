# ⏭️ Skip Already Installed Components

## 📋 Feature

The CLI now automatically detects if a component is already installed and **skips installation** to avoid file overwriting. This is especially useful when:

- A component is manually installed first
- Multiple components depend on the same component (e.g., several components use `button`)
- You reinstall components after making customizations

## 🎯 How It Works

### Automatic Verification

Before installing any component, the CLI:

1. ✅ Fetches component from registry
2. ✅ Checks if **all files** of the component exist in the project
3. ✅ If they exist, skips installation
4. ✅ If they don't exist, installs normally

### Installation Flow

```bash
npx pittaya add orbit-images
```

**Expected output:**

```
Adding 1 component(s)...

   📦 orbit-images requires: button, utils
   ⏭️  button already installed, skipping...
   ⏭️  utils already installed, skipping...

✓ orbit-images installed successfully!

✅ Components added successfully!
```

## 📝 Practical Examples

### Example 1: Duplicate Dependency

```bash
# Install button first
npx pittaya add button

# Then install orbit-images (which depends on button)
npx pittaya add orbit-images
```

**Result:**
- `button` is installed the first time
- `orbit-images` detects that `button` already exists and **doesn't reinstall**
- Your customizations to `button` are preserved

### Example 2: Multiple Components with Same Dependency

```bash
npx pittaya add modal card dialog
```

All depend on `button` and `utils`:

```
   📦 modal requires: button, utils
   ✓ button installed successfully!
   ✓ utils installed successfully!
   ✓ modal installed successfully!

   📦 card requires: button, utils
   ⏭️  button already installed, skipping...
   ⏭️  utils already installed, skipping...
   ✓ card installed successfully!

   📦 dialog requires: button, utils
   ⏭️  button already installed, skipping...
   ⏭️  utils already installed, skipping...
   ✓ dialog installed successfully!
```

### Example 3: Safe Reinstallation

```bash
# You customized button.tsx
# But need to reinstall another component

npx pittaya add orbit-images
```

**Result:**
- Customized `button` is **preserved** (not reinstalled)
- Only `orbit-images` is installed

## 🔧 Force Reinstallation

If you **want** to overwrite existing components, use the `--overwrite` flag:

```bash
npx pittaya add button --overwrite
```

or

```bash
npx pittaya add orbit-images --overwrite
```

With `--overwrite`:
- ✅ Main component is reinstalled
- ✅ Dependencies are also reinstalled (overwriting existing files)

## 🎨 Safe Customization

This feature allows you to:

### ✅ Customize Components Safely

```typescript
// src/components/pittaya/ui/button.tsx
// You customized the button

export function Button({ className, ...props }) {
  return (
    <button 
      className={cn("my-custom-class", className)} 
      {...props} 
    />
  )
}
```

Then install other components without losing your customizations:

```bash
npx pittaya add card modal dialog
# Customized button is not overwritten! ✅
```

### ✅ Install Components in Any Order

Order doesn't matter, already installed components are not reinstalled:

```bash
# Install dependency first
npx pittaya add button

# Then the component that depends on it
npx pittaya add orbit-images
# button is not reinstalled ✅
```

## 🔍 Technical Details

### Installation Check

```typescript
async function isComponentInstalled(
  name: string,
  config: IConfig
): Promise<boolean> {
  // 1. Fetch component from registry
  const component = await getRegistryComponent(name);
  
  // 2. Check each component file
  for (const file of component.files) {
    const filePath = resolveTargetPath(file.name, component.type, config);
    
    // 3. If any file doesn't exist, return false
    const exists = await fs.access(filePath);
    if (!exists) return false;
  }
  
  // 4. All files exist
  return true;
}
```

### Skip Logic

```typescript
async function addComponent(name: string, config: IConfig, options: IAddOptions) {
  // Check if already installed
  const alreadyInstalled = await isComponentInstalled(name, config);
  
  // If already installed AND no --overwrite flag, skip
  if (alreadyInstalled && !options.overwrite) {
    console.log(`⏭️  ${name} already installed, skipping...`);
    return; // ⬅️ Return without installing
  }
  
  // Continue with normal installation...
}
```

### Dependency Verification

```typescript
// When a component has registryDependencies
if (component.registryDependencies?.length > 0) {
  for (const dep of component.registryDependencies) {
    // Each dependency goes through installation check
    await addComponent(dep, config, { ...options, yes: true });
    // ⬆️ If 'dep' is already installed, it will be automatically skipped
  }
}
```

## ⚙️ CLI Options

### `--overwrite`

Forces reinstallation of existing components:

```bash
npx pittaya add button --overwrite
```

### `--yes` or `-y`

Skips confirmations (used internally for dependencies):

```bash
npx pittaya add button --yes
```

### Combining Flags

```bash
npx pittaya add orbit-images --overwrite --yes
```

- Reinstalls everything without asking
- Overwrites existing files

## 📊 Usage Scenarios

| Scenario | Behavior | Required Flag |
|---------|----------|---------------|
| Component doesn't exist | ✅ Installs | - |
| Component already exists | ⏭️ Skips | - |
| Force reinstallation | ✅ Reinstalls | `--overwrite` |
| Dependency already exists | ⏭️ Skips | - |
| Force all deps | ✅ Reinstalls | `--overwrite` |

## 🎯 Benefits

1. **🛡️ Customization Protection**
   - Your modifications aren't lost

2. **⚡ Faster Installation**
   - Doesn't reinstall dependencies unnecessarily

3. **🔄 Idempotency**
   - Running `npx pittaya add button` multiple times is safe

4. **📦 Smart Dependency Management**
   - Only installs what's needed

5. **🎨 Customization Workflow**
   - Customize first, install other components later

## 🚨 Special Cases

### Partially Deleted File

If you deleted **part** of a component's files:

```bash
# button.tsx exists, but button.test.tsx was deleted
npx pittaya add button
# ✅ Detects it's incomplete and reinstalls
```

### Multiple Files

Components with multiple files are fully verified:

```typescript
// Component with 3 files
{
  files: [
    { name: "button.tsx", content: "..." },
    { name: "button.stories.tsx", content: "..." },
    { name: "button.test.tsx", content: "..." }
  ]
}

// All must exist to be considered "installed"
```

## 📚 Logs and Feedback

### Skipped Component

```
⏭️  button already installed, skipping...
```

### Installed Component

```
✓ button installed successfully!
```

### Dependency List

```
📦 orbit-images requires: button, utils
```

### Final Summary

```
✅ Components added successfully!
```

## 🔧 Troubleshooting

### "Component not skipped even though it exists"

**Cause:** File might be in a different location than expected

**Solution:**
1. Check `components.json` - correct aliases?
2. Check if file is in `src/components/pittaya/ui/`
3. Check file permissions

### "Want to force reinstallation but it's not working"

**Solution:**
```bash
npx pittaya add button --overwrite --yes
```

### "Dependency not installed"

**Cause:** It might already be installed

**Verification:**
```bash
ls -la src/components/pittaya/ui/button.tsx
# If it exists, it will be skipped
```

---

**Implemented**: 2025-11-13  
**Version**: CLI 0.0.4+  
**Status**: ✅ Functional
