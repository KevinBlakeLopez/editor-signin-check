# Editor sign-in check

A throwaway test that takes about two hours. Run it before you offer 1b (a static site with a simple editor) on a sales call. It answers one question: can someone without a GitHub account sign in to the editor and change the site, and does the change go live with their name on it?

Everything here is fictional ("Sample Outsourcing Facility"). Delete it all when you're done.

## What's in this folder

| File | What it is |
| --- | --- |
| `.pages.yml` | Pages CMS's settings: the home page's fields, the news list, and where uploaded images go |
| `content/home.json` | The home page: hero, text, cards and call to action, shaped like the SDK's blocks |
| `content/news.json` | Two news items |
| `index.html`, `site.js`, `site.css` | A small page that shows the content |
| `media/hero.svg` | A placeholder image |
| `.nojekyll` | Tells GitHub Pages to publish the files as they are |

The page draws the content in the browser, so the test needs no build step. A real 1b site is built into plain HTML instead.

`.pages.yml` was checked against the rules in Pages CMS's source code, but Pages CMS itself hasn't read it yet. Step 3 is its real test.

## Before you start

- Your GitHub account.
- A second e-mail address you can read, with no GitHub account on it. It plays the client's editor.
- A private browser window for that editor.
- Somewhere to note timings and anything confusing.

## 1. Put the test on GitHub (10 minutes)

From this folder:

```bash
git init -b main
git add -A
git commit -m "Editor sign-in check: test site"
gh repo create editor-signin-check --public --source . --push
```

It's public because GitHub Pages works only on public repositories on GitHub's free plan. If your account is on GitHub Pro, it can be private. The page asks search engines not to index it.

## 2. Publish it with GitHub Pages (5 minutes)

On the repository's page on GitHub, go to Settings, then Pages. Under "Build and deployment", set Source to "Deploy from a branch", choose `main` and `/ (root)`, and save.

After a minute or two the site is at `https://<your-username>.github.io/editor-signin-check/`. Check that it looks like the local copy.

## 3. Connect Pages CMS (15 minutes)

1. Go to [app.pagescms.org](https://app.pagescms.org) and sign in with GitHub.
2. Install the Pages CMS GitHub App. Choose "Only select repositories" and pick `editor-signin-check`, nothing else.
3. Open the repository. **Home page** and **News** should appear in the sidebar. If Pages CMS reports a problem with `.pages.yml`, note the message.
4. As yourself, change the hero heading and save. Check that a commit appears on GitHub, and that the live site shows the change a minute or two later.

## 4. Invite the editor (10 minutes)

In Pages CMS, invite your second e-mail address as a collaborator on this repository. Note what the invitation e-mail says and what signing in asks for.

## 5. Edit as a client would (30 minutes)

In the private window, accept the invitation and sign in. Then do the following, saving after each change:

1. Change the hero heading and text.
2. Replace the hero image with a photo from your computer, and fill in its description.
3. Add a news item.
4. Make one word bold in the Text section.
5. Try to open the settings, change `.pages.yml`, or invite someone. All three should be refused.

## 6. Check the results (20 minutes)

| Check | It passes if |
| --- | --- |
| Sign-in | The editor got in without a GitHub account |
| Editing | Every change in step 5 saved without help |
| Publishing | Each change showed on the live site within a few minutes |
| Name on the change | GitHub shows the editor's name and e-mail on their commits (`.pages.yml` asks for this with `identity: user`) |
| Limits | The editor couldn't change the settings or invite anyone |

Also note how long each step took, and anything a non-technical person would trip over.

## 7. Clean up (10 minutes)

1. Remove the collaborator in Pages CMS.
2. On GitHub, open Settings, then Applications. Uninstall Pages CMS under "Installed GitHub Apps", and revoke it under "Authorized GitHub Apps".
3. Delete the repository: its Settings, then General, then "Delete this repository".

## If Pages CMS falls short

The fallback is Sveltia CMS with its Additions service. Editors sign in with a username and password, and the service runs on your own Cloudflare account. Its settings get written only if this test fails.

## What this test doesn't cover

- The SDK's files source and the Next or Nuxt build. Those wait for the first 1a client.
- Drafts or approval before publishing. In this test, every save goes live.
