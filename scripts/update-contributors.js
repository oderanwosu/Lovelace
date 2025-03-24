const axios = require('axios');
const fs = require('fs');

const OWNER = 'sfsu-acm';    // Replace with your GitHub username
const REPO = 'Lovelace';           // Replace with your repository name
const README_PATH = './README.md';

const GITHUB_TOKEN = process.env.TOKEN;  // Use GitHub token for authentication

async function fetchContributors() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contributors`;
  const response = await axios.get(url, {
    headers: { 
      Authorization: `Bearer ${GITHUB_TOKEN}` 
    }
  });

  return response.data.map(contributor => ({
    username: contributor.login,
    profileUrl: contributor.html_url,
    avatarUrl: `${contributor.avatar_url}?size=100`
  }));
}

function updateReadme(contributors) {
  const contributorRows = contributors.map(c => `
    <td align="center">
      <a href="${c.profileUrl}">
        <img src="${c.avatarUrl}" width="100" style="border-radius: 50%;">
        <br />
        <sub><b>${c.username}</b></sub>
      </a>
    </td>
  `);

  const tableContent = `
<table>
  <tr>
    ${contributorRows.join('\n')}
  </tr>
</table>
`;

  const readmeContent = fs.readFileSync(README_PATH, 'utf-8');
  const updatedContent = readmeContent.replace(
    /<!-- CONTRIBUTORS START -->[\s\S]*?<!-- CONTRIBUTORS END -->/,
    `<!-- CONTRIBUTORS START -->\n${tableContent}\n<!-- CONTRIBUTORS END -->`
  );

  fs.writeFileSync(README_PATH, updatedContent);
  console.log('Contributors updated!');
}

(async () => {
  try {
    const contributors = await fetchContributors();
    updateReadme(contributors);
  } catch (error) {
    console.error('Failed to update contributors:', error);
  }
})();