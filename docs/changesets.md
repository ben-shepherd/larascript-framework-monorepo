# Publishing Packages in Monorepo with Changesets

## Setup Overview

This guide documents how to set up independent package versioning and publishing in a Turborepo-style monorepo using **changesets**.

### Project Structure Example

```text
root/
  package.json
  turbo.json
  .changeset/            # (created after init)
  packages/
    utils/
      package.json
    views/
      package.json
    validator/
      package.json
```

---

## 1. Install Changesets

From the root of the repository:

```bash
pnpm add -D @changesets/cli   # or: npm install -D @changesets/cli
```

---

## 2. Initialize Changesets

```bash
npx changeset init
```

This creates the `.changeset/` folder and a `config.json` file.

---

## 3. Add Scripts to Root `package.json`

```json
"scripts": {
  "changeset": "changeset",
  "version-packages": "changeset version",
  "release": "changeset publish"
}
```

---

## 4. Create a Changeset When You Modify a Package

Run:

```bash
pnpm changeset
```

Follow the prompts:

* Select the packages that changed
* Choose version bump (major / minor / patch)
* Enter a short summary

This creates a markdown file in `.changeset/` describing the change.

---

## 5. Apply Versions Locally

```bash
pnpm version-packages
```

This updates version numbers inside each affected `package.json` and generates/update `CHANGELOG.md` files.

---

## 6. Publish Packages

```bash
pnpm release
```

Only the packages with changes will be published to npm.

---

## Example `.changeset/config.json`

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": [
    "@changesets/changelog-github",
    { "repo": "your-org/your-repo" }
  ],
  "commit": false,
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

---

## Typical Workflow Recap

1. Code changes in `packages/utils`
2. Run: `pnpm changeset`
3. Commit the `.changeset/*.md` file
4. When ready, run:

   ```bash
   pnpm version-packages
   pnpm release
   ```

---

## Benefits of This Setup

* Independent semantic versioning per package
* Only changed packages get published
* Fully compatible with Turborepo and workspaces
* Keeps your framework and utilities reusable by others

---

## Notes

* Each package needs its own name and version in `package.json`
* The root `package.json` defines the workspaces (e.g. `"workspaces": ["packages/*"]`)
* You can use GitHub Actions later to automate the publish step

---

## Next Steps

(Optional) Example: create a sample changeset file when bumping `utils` to 1.1.0. Add this markdown file inside `.changeset/`:

```markdown
---
"@yourorg/utils": minor
---

Add new helper function to format dates.
```

---

**Done!** You can now manage and publish your monorepo packages cleanly with changesets.
