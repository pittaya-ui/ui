## 📦 Publishing Guide (For Maintainers)

### Prerequisites

1. **NPM Account:** Create at https://www.npmjs.com/signup
2. **2FA Recommended:** Enable two-factor authentication for security

### Publishing Steps

#### 1. Verify Package Name Availability

```bash
npm search pittaya
```

**If name is taken, alternatives:**
- `@pittaya-ui/cli`
- `pittaya-ui-cli`
- Another creative name

#### 2. NPM Login

```bash
npm login
# Enter: username, password, email, OTP (if enabled)

# Verify login
npm whoami
```

#### 3. Build and Publish

```bash
cd packages/cli

# Build the CLI
npm run build

# Publish to NPM
npm run pub:release

# Or manually:
# npm publish --access public
```